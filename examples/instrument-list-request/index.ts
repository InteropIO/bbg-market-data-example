import BBGMarketDataFactory, { BBGMarketDataAPI, BBGMarketDataConfig, BloombergError, BloombergEvent, InstrumentListRequestArguments, RequestStatus } from '@glue42/bbg-market-data';
import IOConnect from '@interopio/desktop';

const io = await IOConnect();

const bbgLibraryConfig: BBGMarketDataConfig = {
    debug: true, // Enables logging
};

const bbgMarketData: BBGMarketDataAPI = BBGMarketDataFactory(io.interop, bbgLibraryConfig);

const requestArguments: InstrumentListRequestArguments = {
    query: 'vod',
    maxResults: 1000
};

const request = bbgMarketData.createInstrumentListRequest(requestArguments);

request.onData(({ data, isLast }) => {
    if(isLast) {
        console.log('Response:', data);
    } else {
        console.log('Partial response:', data);
    }
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
