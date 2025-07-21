import BBGMarketDataFactory, { BBGMarketDataAPI, BBGMarketDataConfig, OpenGenericRequestOptions, RequestStatus } from '@glue42/bbg-market-data';
import IOConnect from '@interopio/desktop';

const io = await IOConnect();

const bbgLibraryConfig: BBGMarketDataConfig = {
    debug: true, // Enables logging
};

const bbgMarketData: BBGMarketDataAPI = BBGMarketDataFactory(io.interop, bbgLibraryConfig);

// NOTE: This is an example of creating a generic request for field list. 
// The library supports field list as typed request, so you can use the `createFieldListRequest` method instead.
// FieldListRequest  - https://docs.interop.io/adapters/bloomberg/market-data/javascript/index.html#request_types-field_list

const requestArguments = {
    fieldType: 'RealTime',
};

const req = bbgMarketData.createGenericRequest(requestArguments, '//blp/apiflds', 'FieldListRequest');

req.onRequestStatusChanged((statusEvent) => {
    if (statusEvent.status === RequestStatus.Failed) {
        console.error('Request status changed:', statusEvent.status);
        console.error('Request failed:', statusEvent.error);
    } else {
        console.log('Request status changed:', statusEvent.status);
    }
});

const messageProcessor: OpenGenericRequestOptions['messageProcessor'] = async (evType, evMessage) => {
    console.log(`Event type: ${evType}; Event message:`, JSON.stringify(evMessage));

    // Return `continue: true` to keep receiving events, or `continue: false` to stop processing further events.
    // If you return `continue: false`, the request will be closed automatically - this disposes the requests and cleans up resources.
    return {
        continue: true
    };
};

const newSession = bbgMarketData.sessions.create({ 
    // Provide options as needed.
});

// `messageProcessor` is a required parameter.
req.open({ newSession, messageProcessor })
    .then(() => {
        console.log('Request opened successfully');
    }).catch((err) => {
        console.error('Error opening request:', err);
    });

// Close the request. Will turn the request status to RequestStatus.Closed
// request.close();
