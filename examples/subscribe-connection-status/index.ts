import BBGMarketDataFactory, { BBGMarketDataAPI, ConnectionStatus } from '@glue42/bbg-market-data';
import IOConnect from '@interopio/desktop';

const io = await IOConnect();

const bbgMarketData: BBGMarketDataAPI = BBGMarketDataFactory(io.interop);

// NB! On developer Bloomberg accounts the connection status is "Disconnected". However, you still can execute requests. 
const unsubscribeConnectionStatus = bbgMarketData.onConnectionStatusChanged((status: ConnectionStatus) => {
    console.log(`BBG Market Data API is ${status}`)
});

// Use the library.
