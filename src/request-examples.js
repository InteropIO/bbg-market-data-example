const createNonSubscriptionRequest = ({ requestFactory, requestArgs, eventDispatcher }) => {
    const request = requestFactory(requestArgs);

    const unsubscribeOnData = request.onData(function handleData({ data, isLast }) {
        eventDispatcher.onRequestData(data)
    })

    const unsubscribeOnError = request.onError(function handleError(error) {
        eventDispatcher.onRequestError(error);
    })

    const unsubscribeOnStatus = request.onStatus(function handleStatus(status) {
        eventDispatcher.onRequestStatusChanged(status);
    })

    const unsubscribeOnEvent = request.onEvent(function handleEvent(event) {
        eventDispatcher.onRequestBloombergEvent(event);
    })

    const dispose = async () => {
        // Closing the request.
        await request.close();

        unsubscribeOnData();
        unsubscribeOnError();
        unsubscribeOnStatus();
        unsubscribeOnEvent();
    }

    request.open({ aggregateResponse: false });

    return dispose;
};

const createSubscriptionRequest = ({ requestFactory, requestArgs, eventDispatcher }) => {
    const request = requestFactory(requestArgs);

    const unsubscribeOnData = request.onData(function handleData(data) {
        eventDispatcher.onRequestData(data)
    })

    const unsubscribeOnError = request.onError(function handleError(error) {
        eventDispatcher.onRequestError(error);
    })

    const unsubscribeOnStatus = request.onStatus(function handleStatus(status) {
        eventDispatcher.onRequestStatusChanged(status);
    })

    const unsubscribeOnEvent = request.onEvent(function handleEvent(event) {
        eventDispatcher.onRequestBloombergEvent(event);
    })

    const dispose = async () => {
        // Closing the request.
        await request.close();

        unsubscribeOnData();
        unsubscribeOnError();
        unsubscribeOnStatus();
        unsubscribeOnEvent();
    }

    request.open();

    return dispose;
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
        createRequest: (bbgMarketData, requestArgs, eventDispatcher) => createSubscriptionRequest({
            requestFactory: bbgMarketData.createMarketDataRequest,
            requestArgs: Array.isArray(requestArgs) ? requestArgs : [],
            eventDispatcher
        })
    },
    {
        title: 'Field List Request',
        description: 'Demonstrates how to create and execute a Field List request.',
        requestArguments: {
            fieldType: 'RealTime',
            returnFieldDocumentation: true
        },
        createRequest: (bbgMarketData, requestArgs, eventDispatcher) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createFieldListRequest,
            requestArgs,
            eventDispatcher
        })
    },
    {
        title: 'Field Search Request',
        description: 'Demonstrates how to create and execute a Field Search request.',
        requestArguments: {
            searchSpec: 'last price'
        },
        createRequest: (bbgMarketData, requestArgs, eventDispatcher) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createFieldSearchRequest,
            requestArgs,
            eventDispatcher
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
        createRequest: (bbgMarketData, requestArgs, eventDispatcher) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createHistoricalDataRequest,
            requestArgs,
            eventDispatcher
        })
    },
    {
        title: 'Instrument List Request',
        description: 'Demonstrates how to create and execute an Instrument List request.',
        requestArguments: {
            query: 'VOD',
            maxResults: 5
        },
        createRequest: (bbgMarketData, requestArgs, eventDispatcher) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createInstrumentListRequest,
            requestArgs,
            eventDispatcher
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
        createRequest: (bbgMarketData, requestArgs, eventDispatcher) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createIntraDayBarRequest,
            requestArgs,
            eventDispatcher
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
        createRequest: (bbgMarketData, requestArgs, eventDispatcher) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createReferenceDataRequest,
            requestArgs,
            eventDispatcher
        })
    },
    {
        title: 'Snapshot Request',
        description: 'Demonstrates how to create and execute an Snapshot request.',
        requestArguments: {
            security: "VOD LN Equity"
        },
        createRequest: (bbgMarketData, requestArgs, eventDispatcher) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createSnapshotRequest,
            requestArgs,
            eventDispatcher
        })
    },
    {
        title: 'User Entitlements',
        description: 'Demonstrates how to create and execute an User Entitlements request.',
        requestArguments: {
            uuid: 1000
        },
        createRequest: (bbgMarketData, requestArgs, eventDispatcher) => createNonSubscriptionRequest({
            requestFactory: bbgMarketData.createUserEntitlementsRequest,
            requestArgs,
            eventDispatcher
        })
    },
]