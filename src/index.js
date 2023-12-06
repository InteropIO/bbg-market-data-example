import IOConnectDesktop from "@interopio/desktop";
import '@interopio/theme-demo-apps'
import BBGMarketData, { BloombergError, RequestStatus } from '@glue42/bbg-market-data';
import 'jsoneditor/dist/jsoneditor.css';
import IOSearch from "@interopio/search-api";
import { configs as exampleConfigs } from './request-examples';
import { UiController } from './ui-controller';
import { initializeInstrumentListSearchProvider } from './search-providers/instrument-list-provider';
import pkg from './../package.json';

let io;
let bbgMarketData;
let disposeExecutedRequest;
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
  io = await IOConnectDesktop({
    libraries: [IOSearch]
  });
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
  if (typeof disposeExecutedRequest === 'function') {
    disposeExecutedRequest();
    uiController.disableCreateRequestBtn(false);
  }
}

async function createRequestBtnClickHandler() {

  if (!selectedExampleConfig) {
    return;
  }

  const eventDispatcher = {
    onRequestData: (data) => {
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

      if (status === RequestStatus.Opened || status === RequestStatus.Active) {
        uiController.disableCreateRequestBtn(true);
      } else {
        uiController.disableCreateRequestBtn(false);
      }
    },
    onRequestBloombergEvent: (event) => {
      uiController.setRequestBloombergEventEditorValue(event);
    }
  }

  const requestArgs = uiController.getRequestArgsEditorValue();

  disposeExecutedRequest = selectedExampleConfig.createRequest(window.bbgMarketData, requestArgs, eventDispatcher);

  window.disposeExecutedRequest = disposeExecutedRequest;
}
