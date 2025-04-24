import JSONEditor from 'jsoneditor';
import { RequestStatus, ConnectionStatus } from '@glue42/bbg-market-data';

let requestsSelectElement;
let requestArgsEditor;
let responseEditor;
let errorEditor;
let eventsEditor;
let libConfigEditor;

export class UiController {

    init({ libConfig }) {
        requestsSelectElement = document.getElementById('request-type');

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

        libConfigEditor.set(libConfig)
    }

    aggregateResponseChecked() {
        return document.getElementById("aggregate-response-check").checked;
    }

    hideInitLibraryView() {
        document.getElementById('initialize-library-view').style.display = 'none';
    }

    showRequestExecuteView() {
        document.getElementById('execute-requests-view').style.display = 'block';
    }

    getRequestParamsEditorValue() {
        return requestArgsEditor.get()
    }

    setRequestParamsEditorValue(value) {
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

    setRequestID(value) {
        document.getElementById('request-id').innerHTML = `Request ID: <i>${value}</i>`;
    }

    setRequestStatus(value) {
        const requestStatusTextElement = document.getElementById('request-status');

        if (value) {
            let classList = '';
            if (value === RequestStatus.Failed) {
                classList = 'text-danger';
            } else if (value === RequestStatus.Completed) {
                classList = 'text-success';
            }

            value === RequestStatus.Failed ? 'text-danger' : '';
            requestStatusTextElement.innerHTML = `Request Status: <span class="${classList}" id="request-status">${value}</span>`
        } else {
            requestStatusTextElement.innerHTML = '';
        }
    }

    setConnectionStatus(value) {
        const connectionStatusElement = document.getElementById('connection-status');

        connectionStatusElement.innerHTML = value;
        if (value === ConnectionStatus.Connected) {
            connectionStatusElement.classList = 'badge bg-success';
        } else {
            connectionStatusElement.classList = 'badge bg-danger'
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
        document.getElementById('btn-create-request').addEventListener('click', handler)
    }

    onCloseRequestClick(handler) {
        document.getElementById('btn-close-request').addEventListener('click', handler)
    }

    onClearEditorsClick(handler) {
        document.getElementById('btn-clear-editors').addEventListener('click', handler)
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
        document.getElementById('init-library-btn').addEventListener('click', handler)
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