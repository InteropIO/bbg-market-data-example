require('jsoneditor/dist/jsoneditor.css');
require('./../styles/t42bootstrap.bundle.css');
require('jquery/dist/jquery');
require('bootstrap/dist/js/bootstrap.bundle');

import JSONEditor from 'jsoneditor';
import Glue from "@glue42/desktop";
import JsBBG from '@glue42/bbg-market-data';
import { RequestType } from '@glue42/bbg-market-data/dist/cjs/request-types'

import { getDefaultArgs } from './request-default-args';
import { createRequest, fillRequestTypeOptions, editorOptions } from './helpers';

const containerRequest = document.getElementById('jsoneditor-request');
const containerResponse = document.getElementById('jsoneditor-response');
const containerError = document.getElementById('jsoneditor-error');
const containerEvents = document.getElementById('jsoneditor-events');

const openRequestBtn = document.getElementById('btn-open');
const closeRequestBtn = document.getElementById('btn-close');
const clearEditorsBtn = document.getElementById('btn-clear');
const requestTypeSelect = document.getElementById('request-type');
const requestStatusText = document.getElementById('request-status');

const requestArgsEditor = new JSONEditor(containerRequest, editorOptions);
const responseEditor = new JSONEditor(containerResponse, editorOptions);
const errorEditor = new JSONEditor(containerError, editorOptions);
const eventsEditor = new JSONEditor(containerEvents, editorOptions);

let lib;
let currentRequest;
const unsubscribeCallbacks = [];

const initGlueCore = () => Glue()
  .then((glue) => {
    console.log(`Glue ${glue.version} initialized.`);

    window.glueCore = glue;
    return glue;
  })
  .catch((err) => {
    console.error('Glue initialization failed ', err);
    throw err;
  });

const initJsBBG = (interop) => JsBBG(interop, { debug: true });

function eventHandler(event) {
  console.log('[ON EVENT] ', event);
  eventsEditor.set(event);
}

function statusHandler(status) {
  console.log('[ON STATUS] ', status);
  requestStatusText.innerHTML = status;
}

function responseHandler(resp) {
  console.log('[ON DATA] ', resp);
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

  // Send the request to Bloomberg.
  request.open();
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

  // Send the request to Bloomberg and wait for aggregated response
  request.open({ aggregateResponse: true })
    .then((response) => {
      responseEditor.set(response);
      console.log('[RESPONSE]', response);
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

  statusHandler('');
}

function onOpenRequest() {
  onClearEditors();

  unsubscribeCallbacks.forEach(cb => cb());

  const requestArgs = requestArgsEditor.get();
  const requestType = requestTypeSelect.options[requestTypeSelect.selectedIndex].value

  currentRequest = createRequest(lib, requestType, requestArgs);

  if (RequestType.MarketSubscription === requestType) {
    openSubscriptionRequest(currentRequest)
  } else {
    openNonSubscriptionRequest(currentRequest);
  }
}

function onCloseRequest() {
  if (currentRequest) {
    currentRequest.close()
      .then(console.log, console.warn)
  }
}

async function init() {
  const glueCore = await initGlueCore();
  lib = initJsBBG(glueCore.interop);

  onRequestTypeChange();

  openRequestBtn.addEventListener('click', onOpenRequest);
  closeRequestBtn.addEventListener('click', onCloseRequest);
  clearEditorsBtn.addEventListener('click', onClearEditors);
  requestTypeSelect.addEventListener('change', onRequestTypeChange);
}

fillRequestTypeOptions(requestTypeSelect);
init();
