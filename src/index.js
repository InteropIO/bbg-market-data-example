import IOConnectDesktop from "@interopio/desktop";
import '@interopio/theme-demo-apps'
import BBGMarketData, { BloombergError } from '@glue42/bbg-market-data';
import 'jsoneditor/dist/jsoneditor.css';
import IOSearch from "@interopio/search-api";
import { configs as exampleConfigs } from './requests';
import { UiController } from './ui-controller';
import { initializeInstrumentListSearchProvider } from './search-providers/instrument-list-provider';
import pkg from './../package.json';

let io;
let bbgMarketData;
let executedRequest;
let unsubscribeRequestEvents;
let uiController;
let selectedExampleConfig

// Entry point.
window.addEventListener('DOMContentLoaded', main);

async function main() {
  uiController = new UiController();
  uiController.init();

  uiController.setAppVersion(`App Version: ${pkg.version}`);

  await initializeIOConnect();

  uiController.setIOConnectVersion(`IO Connect Version: ${io.info.version}`)

  const requestsSelectOptions = exampleConfigs.map(({ title }) => ({ text: title, value: title }));
  uiController.setRequestsSelectOptions(requestsSelectOptions);

  uiController.onInitLibraryClick(initLibraryBtnClickHandler);

  uiController.onSelectedRequestChanged(selectedRequestChangedHandler);

  uiController.onCreateRequestClick(createRequestBtnClickHandler);

  uiController.onCloseRequestClick(closeRequestBtnClickHandler);

  uiController.onClearEditorsClick(clearEditorsClickHandler);
}

function clearEditorsClickHandler() {
  uiController.setRequestResponseEditorValue({});
  uiController.setRequestErrorEditorValue({});
  uiController.setRequestBloombergEventEditorValue({});
}

function initLibraryBtnClickHandler() {
  uiController.hideInitLibraryView();

  uiController.showRequestExecuteView();

  const libConfig = uiController.getLibInitConfigEditorValue();
  const methodNamePrefix = uiController.getMethodPrefixInputValue();

  initializeBBGMarketData(io, libConfig, methodNamePrefix);

  uiController.setBbgMarketDataVersion(`BBG Market Data Version: ${bbgMarketData.version}`)

  subscribeToConnectionStatus();

  initializeInstrumentListSearchProvider(io, bbgMarketData);
}

function subscribeToConnectionStatus() {
  bbgMarketData.onConnectionStatusChanged((status) => {
    uiController.setConnectionStatus(status);
  });
}

async function initializeIOConnect() {
  io = await IOConnectDesktop();
  await IOSearch(io).catch(console.error);
  window.io = io;
}

function initializeBBGMarketData(io, config, methodNamePrefix) {
  const overrideProtocolMethods = (defaultMethods) => {
    const withMethodNamePrefix = (name) => {
      const [t42, mdfApi, actionName] = name.split('.');
      return `${t42}.${mdfApi}.${methodNamePrefix}${actionName}`;
    }

    const overrides = Object.entries(defaultMethods).reduce(
      (overrides, [key, methodDef]) => ({
        ...overrides,
        [key]: {
          ...methodDef,
          name: withMethodNamePrefix(methodDef.name),
        },
      }),
      {}
    );

    return overrides;
  };

  bbgMarketData = BBGMarketData(io.interop, {
    ...config,
    overrideProtocolMethods
  });
  window.bbgMarketData = bbgMarketData;
}

function selectedRequestChangedHandler(value) {
  selectedExampleConfig = exampleConfigs.find(({ title }) => title === value);
  if (selectedExampleConfig) {
    uiController.setRequestArgsEditorValue(selectedExampleConfig.requestArguments)

    uiController.setRequestDescription(selectedExampleConfig.description)
  }
}

async function closeRequestBtnClickHandler() {
  if (executedRequest != null) {
    executedRequest.close();
  }
}

async function createRequestBtnClickHandler() {
  if (!selectedExampleConfig) {
    return;
  }

  if (executedRequest != null) {
    // Clean up.
    executedRequest.close();
  }

  if (typeof unsubscribeRequestEvents === 'function') {
    // Making sure to not receive event (data, error, bbg event) from an old request. 
    unsubscribeRequestEvents();
  }

  clearEditorsClickHandler();

  const aggregateResponse = uiController.aggregateResponseChecked();

  const eventDispatcher = {
    onRequestData: (data) => {
      if (aggregateResponse) {
        console.log('Aggregated Response: ', data);
      }

      uiController.setRequestResponseEditorValue(data);
    },
    onRequestError: (error) => {
      if (error instanceof BloombergError) {
        uiController.setRequestErrorEditorValue(error)
      } else {
        const errorStr = JSON.stringify(error, Object.getOwnPropertyNames(error));
        const errorJson = JSON.parse(errorStr);
        uiController.setRequestErrorEditorValue(errorJson)
      }
    },
    onRequestStatusChanged: (status) => {
      uiController.setRequestStatus(status);
    },
    onRequestBloombergEvent: (event) => {
      uiController.setRequestBloombergEventEditorValue(event);
    }
  }

  const requestArgs = uiController.getRequestArgsEditorValue();

  const { request, unsubscribeEvents } = selectedExampleConfig.createRequest(window.bbgMarketData, requestArgs, eventDispatcher, aggregateResponse);

  uiController.setRequestID(request.id);

  executedRequest = request;
  unsubscribeRequestEvents = unsubscribeEvents;

  window.executedRequest = request;
  window.unsubscribeRequestEvents = unsubscribeEvents;
}
