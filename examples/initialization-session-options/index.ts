import BBGMarketDataFactory, { BBGMarketDataAPI, BBGMarketDataConfig, SessionOptions } from '@glue42/bbg-market-data';
import IOConnect from '@interopio/desktop';

const io = await IOConnect();

// Unless you need to provide specific session options, provide nothing. 
const sessionOptions: SessionOptions = {
    serviceCheckTimeout: 120 * 1000,
    serverHost: 'example',
    serverPort: 4242,
    // ...
};

const bbgLibraryConfig: BBGMarketDataConfig = {
    debug: true, // Enables logging
    sessionSettings: {
        options: sessionOptions
    }
};

const bbgMarketData: BBGMarketDataAPI = BBGMarketDataFactory(io.interop, bbgLibraryConfig);

// Use the library.
