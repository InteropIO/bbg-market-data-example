import BBGMarketDataFactory, { BBGMarketDataAPI, BBGMarketDataConfig, BloombergError, BloombergEvent, RequestStatus, Subscription, SubscriptionData, SubscriptionError } from '@glue42/bbg-market-data';
import IOConnect from '@interopio/desktop';

const io = await IOConnect();

const bbgLibraryConfig: BBGMarketDataConfig = {
    debug: true, // Enables logging
};

const bbgMarketData: BBGMarketDataAPI = BBGMarketDataFactory(io.interop, bbgLibraryConfig);

const subscriptions: Subscription[] = [
    {
        security: 'IBM US Equity',
        fields: ['LAST_PRICE', 'BID', 'ASK', 'BID_YIELD', 'ASK_YIELD']
    },
    {
        security: 'MSFT US Equity',
        fields: ['LAST_PRICE', 'BID', 'ASK', 'BID_YIELD', 'ASK_YIELD']
    }
]

const request = bbgMarketData.createMarketDataRequest(subscriptions);

request.onData((data: SubscriptionData[]) => {
    data.forEach(({ security, subscriptionId, ...mktData }) => {
        console.log(`Market Data for ${security}:`, mktData);
    });
});

request.onError((error: BloombergError | Error) => {
    if (error instanceof BloombergError) {
        console.error(`Bloomberg Error -
            Event type: ${error.eventType}; 
            Message type: ${error.eventMessage}; 
            Details: ${JSON.stringify(error.details)}; 
        `)
      } else {
        console.error(error.message);
      }
})

request.onFail((errors: SubscriptionError[]) => {
    errors.forEach(({ security, ...error }) => {
        console.error(`Subscription error for ${security}:`, error);
    })
})

request.onStatus((requestStatus: RequestStatus) => {
    console.log('Request Status:', requestStatus);
})

request.onEvent((event: BloombergEvent) => {
    console.log('Raw event:', event)
})

// Send the actual request.
request.open();

// Close the request. Will turn the request status to RequestStatus.Closed
// request.close();
