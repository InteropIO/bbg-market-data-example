const createNonSubscriptionRequest = ({ requestFactory, requestArgs, eventsHandler, aggregateResponse }) => {
    const request = requestFactory(requestArgs);

    const unsubscribeOnData = request.onData(function handleData({ data, isLast }) {
        if(!aggregateResponse) {
            eventsHandler.onRequestData(data)
        }
    })

    const unsubscribeOnError = request.onError(function handleError(error) {
        eventsHandler.onRequestError(error);
    })

    const unsubscribeOnStatus = request.onStatus(function handleStatus(status) {
        eventsHandler.onRequestStatusChanged(status);
    })

    const unsubscribeOnEvent = request.onEvent(function handleEvent(event) {
        eventsHandler.onRequestBloombergEvent(event);
    })

    const unsubscribeEvents = async () => {
        unsubscribeOnData();
        unsubscribeOnError();
        unsubscribeOnStatus();
        unsubscribeOnEvent();
    }

    if (aggregateResponse === true) {
        request.open({ aggregateResponse: true })
            .then(function handleAggregatedResponseData(data) {
                eventsHandler.onRequestData(data)
            })
            .catch(function handleError(error) {
                eventsHandler.onRequestError(error);
            })
    } else {
        request.open({ aggregateResponse: false })
    }

    return {
        request,
        unsubscribeEvents
    };
};

const createSubscriptionRequest = ({ requestFactory, requestArgs, eventsHandler }) => {
    const request = requestFactory(requestArgs);

    const unsubscribeOnData = request.onData(function handleData(data) {
        eventsHandler.onRequestData(data)
    })

    const unsubscribeOnError = request.onError(function handleError(error) {
        eventsHandler.onRequestError(error);
    })

    const unsubscribeOnStatus = request.onStatus(function handleStatus(status) {
        eventsHandler.onRequestStatusChanged(status);
    })

    const unsubscribeOnEvent = request.onEvent(function handleEvent(event) {
        eventsHandler.onRequestBloombergEvent(event);
    })

    const unsubscribeEvents = async () => {
        // Closing the request.
        await request.close();

        unsubscribeOnData();
        unsubscribeOnError();
        unsubscribeOnStatus();
        unsubscribeOnEvent();
    }

    request.open();

    return {
        request,
        unsubscribeEvents
    };
};


export const configs = [
    {
        title: 'Market Data Subscription Request',
        description: 'Demonstrates how to create and execute a Market Data Subscription request.',
        requestArguments: [
            {
                security: 'IBM US Equity',
                fields: ['LAST_PRICE', 'BID', 'ASK', 'BID_YIELD', 'ASK_YIELD']
            },
            {
                security: 'MSFT US Equity',
                fields: ['LAST_PRICE', 'BID', 'ASK', 'BID_YIELD', 'ASK_YIELD']
            }
        ],
        createRequest: (bbgMarketData, requestArgs, eventsHandler) => createSubscriptionRequest({
            requestFactory: bbgMarketData.createMarketDataRequest,
            requestArgs: Array.isArray(requestArgs) ? requestArgs : [],
            eventsHandler
        })
    },
    {
        title: 'Field List Request',
        description: 'Demonstrates how to create and execute a Field List request.',
        requestArguments: {
            fieldType: 'RealTime',
            returnFieldDocumentation: true
        },
        createRequest: (bbgMarketData, requestArgs, eventsHandler, aggregateResponse) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createFieldListRequest,
            requestArgs,
            eventsHandler,
            aggregateResponse
        })
    },
    {
        title: 'Field Search Request',
        description: 'Demonstrates how to create and execute a Field Search request.',
        requestArguments: {
            searchSpec: 'last price'
        },
        createRequest: (bbgMarketData, requestArgs, eventsHandler, aggregateResponse) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createFieldSearchRequest,
            requestArgs,
            eventsHandler,
            aggregateResponse
        })
    },
    {
        title: 'Historical Data Request',
        description: 'Demonstrates how to create and execute a Historical Data request.',
        requestArguments: {
            'periodicityAdjustment': 'ACTUAL',
            'periodicitySelection': 'MONTHLY',
            'startDate': '20060101',
            'endDate': '20061231',
            'maxDataPoints': 100,
            'returnEids': true,
            'securities': ['IBM US Equity', 'MSFT US Equity'],
            'fields': ['PX_LAST', 'OPEN'],
            'nonTradingDayFillOption': 'NON_TRADING_WEEKDAYS',
            'nonTradingDayFillMethod': 'PREVIOUS_VALUE'
        },
        createRequest: (bbgMarketData, requestArgs, eventsHandler, aggregateResponse) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createHistoricalDataRequest,
            requestArgs,
            eventsHandler,
            aggregateResponse
        })
    },
    {
        title: 'Instrument List Request',
        description: 'Demonstrates how to create and execute an Instrument List request.',
        requestArguments: {
            query: 'VOD',
            maxResults: 5
        },
        createRequest: (bbgMarketData, requestArgs, eventsHandler, aggregateResponse) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createInstrumentListRequest,
            requestArgs,
            eventsHandler,
            aggregateResponse
        })
    },
    {
        title: 'Intraday Bar Request',
        description: 'Demonstrates how to create and execute an Intraday Bar request.',
        requestArguments: {
            'startDateTime': '2019-02-01',
            'endDateTime': '2019-12-10',
            'eventType': 'TRADE',
            'maxDataPoints': 100,
            'returnEids': true,
            'interval': 60,
            'security': 'IBM US Equity',
        },
        createRequest: (bbgMarketData, requestArgs, eventsHandler, aggregateResponse) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createIntraDayBarRequest,
            requestArgs,
            eventsHandler,
            aggregateResponse
        })
    },
    {
        title: 'Reference Data Request',
        description: 'Demonstrates how to create and execute an Reference Data request.',
        requestArguments: {
            'securities': ['IBM US Equity', 'MSFT US Equity'],
            'fields': ['PX_LAST', 'OPEN'],
            'returnEids': true,
        },
        createRequest: (bbgMarketData, requestArgs, eventsHandler, aggregateResponse) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createReferenceDataRequest,
            requestArgs,
            eventsHandler,
            aggregateResponse
        })
    },
    {
        title: 'Snapshot Request',
        description: 'Demonstrates how to create and execute an Snapshot request.',
        requestArguments: {
            security: "VOD LN Equity"
        },
        createRequest: (bbgMarketData, requestArgs, eventsHandler, aggregateResponse) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createSnapshotRequest,
            requestArgs,
            eventsHandler,
            aggregateResponse
        })
    },
    {
        title: 'User Entitlements',
        description: 'Demonstrates how to create and execute an User Entitlements request.',
        requestArguments: {
            uuid: 1000
        },
        createRequest: (bbgMarketData, requestArgs, eventsHandler, aggregateResponse) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createUserEntitlementsRequest,
            requestArgs,
            eventsHandler,
            aggregateResponse
        })
    },
]