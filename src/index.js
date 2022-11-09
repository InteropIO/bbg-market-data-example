import Glue from "@glue42/desktop";
import '@glue42/theme'
import { RequestType } from '@glue42/bbg-market-data/dist/cjs/request-types'
import BBGMarketData, { Session } from '@glue42/bbg-market-data';
import 'jsoneditor/dist/jsoneditor.css';
import JSONEditor from 'jsoneditor';
import { getDefaultArgs } from './request-default-args';

// Entry point.
window.addEventListener('DOMContentLoaded', () => {
  start();
});

let containerRequest;
let containerResponse;
let containerError;
let containerEvents;
let openRequestBtn;
let closeRequestBtn;
let clearEditorsBtn;
let requestTypeSelect;
let requestStatusText;
let requestArgsEditor;
let responseEditor;
let errorEditor;
let eventsEditor;
let connectionStatus;

let bbgMarketData;
let currentRequest;
const unsubscribeCallbacks = [];

const log = (...args) => {
  args.unshift("#### " + new Date().toISOString() + ":");
  console.log.apply(null, args);
};

async function start() {
  const glue = await Glue();
  window.glue = glue;
  log(`Glue42 initialized. Version: ${glue.version}`);

  bbgMarketData = BBGMarketData(glue.interop, { connectionPeriodMsecs: 6 * 1000 });
  window.bbgMarketData = bbgMarketData;
  log(`BBG Market Data initialized. Version: ${bbgMarketData.version}`);

  bindUI();
  fillRequestTypeOptions(requestTypeSelect);

  bbgMarketData.onConnectionStatusChanged((status) => {
    log('Connection Status: ', status)

    connectionStatus.innerHTML = status;
    if (status === 'Connected') {
      connectionStatus.classList = 'badge badge-success';
    } else {
      connectionStatus.classList = 'badge badge-danger'
    }
  });

  onRequestTypeChange();

  openRequestBtn.addEventListener('click', openRequest);
  closeRequestBtn.addEventListener('click', closeRequest);
  clearEditorsBtn.addEventListener('click', onClearEditors);
  requestTypeSelect.addEventListener('change', onRequestTypeChange);
}

function bindUI() {
  openRequestBtn = document.getElementById('btn-open');
  closeRequestBtn = document.getElementById('btn-close');
  clearEditorsBtn = document.getElementById('btn-clear');
  requestTypeSelect = document.getElementById('request-type');
  requestStatusText = document.getElementById('request-status');
  connectionStatus = document.getElementById('connection-status');

  containerRequest = document.getElementById('jsoneditor-request-args');
  containerResponse = document.getElementById('jsoneditor-response');
  containerError = document.getElementById('jsoneditor-error');
  containerEvents = document.getElementById('jsoneditor-events');

  const editorOptions = {
    mode: 'code',
    modes: ['code', 'tree'],
    onError: function (err) {
      alert(err.toString())
    },
  };
  requestArgsEditor = new JSONEditor(containerRequest, editorOptions);
  responseEditor = new JSONEditor(containerResponse, editorOptions);
  errorEditor = new JSONEditor(containerError, editorOptions);
  eventsEditor = new JSONEditor(containerEvents, editorOptions);
}

function eventHandler(event) {
  log('[ON EVENT] ', event);
  eventsEditor.set(event);
}

function statusHandler(status) {
  log('[ON STATUS] ', status);

  if (status) {
    requestStatusText.innerHTML = `Request Status: <span id="request-status">${status}</span>`
  } else {
    requestStatusText.innerHTML = '';
  }
}

function responseHandler(resp) {
  log('[ON DATA] ', resp);
  responseEditor.set(resp);
}

function errorHandler(err) {
  console.error('[ON ERROR] ', err);

  const errStr = JSON.stringify(err, Object.getOwnPropertyNames(err));
  const errJson = JSON.parse(errStr);
  errorEditor.set(errJson);
}

function subscriptionsFailHandler(errors) {
  console.warn('[ON SUBSCRIPTIONS FAIL] ', errors);
}

function openSubscriptionRequest(request) {
  // Listen for partial response
  unsubscribeCallbacks.push(request.onData(responseHandler));

  // Listen for request errors
  unsubscribeCallbacks.push(request.onError(errorHandler));

  // Listen for subscription failures
  unsubscribeCallbacks.push(request.onFail(subscriptionsFailHandler));

  // Listen for all Bloomberg events
  unsubscribeCallbacks.push(request.onEvent(eventHandler));

  // Listen for request status
  unsubscribeCallbacks.push(request.onStatus(statusHandler));

  // Send the request to Bloomberg. Explicitly states the default session for subscription requests - RealTime.
  request.open({ session: Session.RealTime });
}

function openNonSubscriptionRequest(request) {
  // Listen for partial response
  unsubscribeCallbacks.push(request.onData(responseHandler));

  // Listen for request errors
  unsubscribeCallbacks.push(request.onError(errorHandler));

  // Listen for all Bloomberg events
  unsubscribeCallbacks.push(request.onEvent(eventHandler));

  // Listen for request status
  unsubscribeCallbacks.push(request.onStatus(statusHandler));

  // Send the request to Bloomberg and wait for aggregated response. Explicitly states that the default session should be used.
  request.open({ aggregateResponse: true, session: Session.Default })
    .then((response) => {
      responseEditor.set(response);
      log('[RESPONSE]', response);
    }, (err) => {
      console.error('[RESPONSE ERROR] ', err);
    });
}

function onRequestTypeChange() {
  const requestType = requestTypeSelect.options[requestTypeSelect.selectedIndex].value
  requestArgsEditor.set(getDefaultArgs(requestType));
}

function onClearEditors() {
  responseEditor.set({});
  errorEditor.set({});
  eventsEditor.set({});

  statusHandler(undefined);
}

async function closeRequest() {
  if (currentRequest != null) {
    await currentRequest.close()
  }
}

async function openRequest() {
  onClearEditors();
  unsubscribeCallbacks.forEach(cb => cb());

  await closeRequest()

  const requestArgs = requestArgsEditor.get();
  const requestType = requestTypeSelect.options[requestTypeSelect.selectedIndex].value

  currentRequest = createRequest(requestType, requestArgs);
  window.currentRequest = currentRequest;

  if (RequestType.MarketSubscription === requestType) {
    openSubscriptionRequest(currentRequest)
  } else {
    openNonSubscriptionRequest(currentRequest);
  }
}

function createRequest(requestType, requestArgs) {
  log(`Create request of type ${requestType} with arguments: ${JSON.stringify(requestArgs)}`);

  switch (requestType) {
    case RequestType.MarketSubscription: return bbgMarketData.createMarketDataRequest(requestArgs)
    case RequestType.HistoricalData: return bbgMarketData.createHistoricalDataRequest(requestArgs)
    case RequestType.ReferenceData: return bbgMarketData.createReferenceDataRequest(requestArgs)
    case RequestType.IntraDayBar: return bbgMarketData.createIntraDayBarRequest(requestArgs)
    case RequestType.InstrumentList: return bbgMarketData.createInstrumentListRequest(requestArgs)
    case RequestType.Snapshot: return bbgMarketData.createSnapshotRequest(requestArgs)
    case RequestType.FieldSearch: return bbgMarketData.createFieldSearchRequest(requestArgs)
    case RequestType.FieldList: return bbgMarketData.createFieldListRequest(requestArgs)
    case RequestType.UserEntitlements: return bbgMarketData.createUserEntitlementsRequest(requestArgs)
    default:
      throw new Error('Unknown request type ' + requestType);
  }
}

function fillRequestTypeOptions(select) {
  const requestTypes = Object.keys(RequestType).map((key) => RequestType[key]);

  requestTypes.forEach((type, ind) => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    if (ind === 0) {
      opt.defaultSelected = true;
    }
    select.appendChild(opt);
  });
}

