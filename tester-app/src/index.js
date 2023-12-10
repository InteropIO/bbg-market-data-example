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

const main = async () => {
  uiController = new UiController();

  uiController.init({
    libConfig: {
      debug: false,
      logLevel: 'info',
      sessionSettings: {
        options: undefined,
        identityOptions: undefined
      }
    }
  });

  uiController.setAppVersion(`App Version: ${pkg.version}`);

  await initializeIOConnect();

  uiController.setIOConnectVersion(`IO Connect JS Version: ${io.info.version}`);

  const requestsSelectOptions = exampleConfigs.map(({ title }) => ({ text: title, value: title }));
  uiController.setRequestsSelectOptions(requestsSelectOptions);

  uiController.onInitLibraryClick(initLibraryBtnClickHandler);

  uiController.onSelectedRequestChanged(selectedRequestChangedHandler);

  uiController.onCreateRequestClick(createRequestBtnClickHandler);

  uiController.onCloseRequestClick(closeRequestBtnClickHandler);

  uiController.onClearEditorsClick(clearEditorsClickHandler);
}

const initLibraryBtnClickHandler = () => {
  uiController.hideInitLibraryView();

  uiController.showRequestExecuteView();

  const libConfig = uiController.getLibInitConfigEditorValue();
  const methodNamePrefix = uiController.getMethodPrefixInputValue();

  initializeBBGMarketData(io, libConfig, methodNamePrefix);

  uiController.setBbgMarketDataVersion(`BBG Market Data JS Version: ${bbgMarketData.version}`)

  subscribeToConnectionStatus();

  initializeInstrumentListSearchProvider(io, bbgMarketData).catch(console.error);
}

const subscribeToConnectionStatus = () => {
  bbgMarketData.onConnectionStatusChanged((status) => {
    uiController.setConnectionStatus(status);
  });
}

const initializeIOConnect = async () => {
  io = await IOConnectDesktop();

  await IOSearch(io).catch(console.error);

  window.io = io;
}

const initializeBBGMarketData = (io, config, methodNamePrefix) => {

  const overrideProtocolMethods = (defaultMethods) => {
    const withMethodNamePrefix = (name) => {
      const [t42, mdfApi, actionName] = name.split('.'); // e.g. T42.MdfApi.CreateRequest
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

  // An example of initializing the library with a custom logger.
  const bbgMarketDataLogger = io.logger.subLogger('bbg-market-data-lib');
  bbgMarketDataLogger.consoleLevel('info');

  bbgMarketData = BBGMarketData(io.interop, {
    ...config,
    logger: bbgMarketDataLogger,
    overrideProtocolMethods
  });
  window.bbgMarketData = bbgMarketData;
}

const selectedRequestChangedHandler = (value) => {
  selectedExampleConfig = exampleConfigs.find(({ title }) => title === value);
  if (selectedExampleConfig) {
    uiController.setRequestArgsEditorValue(selectedExampleConfig.requestArguments)

    uiController.setRequestDescription(selectedExampleConfig.description)
  }
}

const createRequestBtnClickHandler = () => {
  if (!selectedExampleConfig) {
    return;
  }

  if (executedRequest != null) {
    // Clean up.
    executedRequest.close();
  }

  if (typeof unsubscribeRequestEvents === 'function') {
    // Making sure to not display events (data, error, bbg event) from an old request. 
    unsubscribeRequestEvents();
  }

  clearEditorsClickHandler();

  const aggregateResponse = uiController.aggregateResponseChecked();

  const eventsHandler = {
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

  const { request, unsubscribeEvents } = selectedExampleConfig.createRequest(window.bbgMarketData, requestArgs, eventsHandler, aggregateResponse);

  uiController.setRequestID(request.id);

  executedRequest = request;
  unsubscribeRequestEvents = unsubscribeEvents;

  window.executedRequest = request;
  window.unsubscribeRequestEvents = unsubscribeEvents;
}

const closeRequestBtnClickHandler = () => {
  if (executedRequest != null) {
    executedRequest.close();
  }
}

const clearEditorsClickHandler = () => {
  uiController.setRequestResponseEditorValue({});
  uiController.setRequestErrorEditorValue({});
  uiController.setRequestBloombergEventEditorValue({});
}

// Entry point.
window.addEventListener('DOMContentLoaded', main);