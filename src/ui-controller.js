import JSONEditor from 'jsoneditor';

let createRequestBtnElement;
let closeRequestBtnElement;
let clearEditorsBtnElement;
let requestsSelectElement;
let requestStatusTextElement;
let requestArgsEditor;
let responseEditor;
let errorEditor;
let eventsEditor;
let connectionStatus;
let libConfigEditor;
let initLibraryBtn;

export class UiController {

    init() {
        createRequestBtnElement = document.getElementById('btn-open');
        closeRequestBtnElement = document.getElementById('btn-close');
        requestsSelectElement = document.getElementById('request-type');
        requestStatusTextElement = document.getElementById('request-status');
        connectionStatus = document.getElementById('connection-status');
        initLibraryBtn = document.getElementById('init-library-btn');
        clearEditorsBtnElement = document.getElementById('btn-clear');

        const editorOptions = {
            search: true,
            mode: 'code',
            modes: ['code', 'tree'],
            onError: function (err) {
                alert(err.toString())
            },
        };

        requestArgsEditor = new JSONEditor(document.getElementById('jsoneditor-request-args'), editorOptions);
        responseEditor = new JSONEditor(document.getElementById('jsoneditor-response'), editorOptions);
        errorEditor = new JSONEditor(document.getElementById('jsoneditor-error'), editorOptions);
        eventsEditor = new JSONEditor(document.getElementById('jsoneditor-events'), editorOptions);
        libConfigEditor = new JSONEditor(document.getElementById('lib-config-editor'), editorOptions);

        libConfigEditor.set({
            debug: false,
            logLevel: 'info',
            sessionSettings: {
                options: undefined,
                identityOptions: undefined
            }
        })
    }

    disableCreateRequestBtn(disabled) {
        createRequestBtnElement.disabled = disabled;
    }

    hideInitLibraryView() {
        document.getElementById('initialize-library-view').style.display = 'none';
    }

    showRequestExecuteView() {
        document.getElementById('execute-requests-view').style.display = 'block';
    }

    getRequestArgsEditorValue() {
        return requestArgsEditor.get()
    }

    setRequestArgsEditorValue(value) {
        requestArgsEditor.set(value)
    }

    setRequestResponseEditorValue(value) {
        responseEditor.set(value)
    }

    setRequestErrorEditorValue(value) {
        errorEditor.set(value)
    }

    setRequestBloombergEventEditorValue(value) {
        eventsEditor.set(value);
    }

    setRequestDescription(value) {
        document.getElementById('request-description').textContent = value;
    }

    setRequestStatus(value) {
        if (value) {
            requestStatusTextElement.innerHTML = `Request Status: <span id="request-status">${value}</span>`
        } else {
            requestStatusTextElement.innerHTML = '';
        }
    }

    setConnectionStatus(value) {
        connectionStatus.innerHTML = value;
        if (value === 'Connected') {
            connectionStatus.classList = 'badge badge-success';
        } else {
            connectionStatus.classList = 'badge badge-danger'
        }
    }

    setAppVersion(value) {
        document.getElementById('app-version').textContent = value
    }

    setIOConnectVersion(value) {
        document.getElementById('io-connect-version').textContent = value
    }

    setBbgMarketDataVersion(value) {
        document.getElementById('bbg-market-data-version').textContent = value
    }

    onCreateRequestClick(handler) {
        createRequestBtnElement.addEventListener('click', handler)
    }

    onCloseRequestClick(handler) {
        closeRequestBtnElement.addEventListener('click', handler)
    }

    onClearEditorsClick(handler) {
        clearEditorsBtnElement.addEventListener('click', handler)
    }

    onSelectedRequestChanged(handler) {
        const getSelectedValue = () => requestsSelectElement.value;

        // reply
        handler(getSelectedValue())

        requestsSelectElement.addEventListener('change', () => {
            handler(getSelectedValue());
        })
    }

    onInitLibraryClick(handler) {
        initLibraryBtn.addEventListener('click', handler)
    }

    getMethodPrefixInputValue() {
        return document.getElementById('protocol-methods-prefix').value;
    }

    getLibInitConfigEditorValue() {
        return libConfigEditor.get()
    }

    setRequestsSelectOptions(options) {
        options.forEach(function createSelectOptionElement({ value, text }, index) {
            const optionsElement = document.createElement("option");
            optionsElement.value = value;
            optionsElement.textContent = text;

            if (index === 0) {
                optionsElement.defaultSelected = true;
            }

            requestsSelectElement.appendChild(optionsElement);
        });
    }
}