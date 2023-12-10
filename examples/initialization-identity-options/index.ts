import BBGMarketDataFactory, { BBGMarketDataAPI, BBGMarketDataConfig, SessionIdentityOptions } from '@glue42/bbg-market-data';
import IOConnect from '@interopio/desktop';

const io = await IOConnect();

// Unless you need to provide specific identity options to establish a session connection, provide nothing.
const sessionIdentityOptions: SessionIdentityOptions = {
    authToken: '...',
    // ...
};

const bbgLibraryConfig: BBGMarketDataConfig = {
    debug: true, // Enables logging
    sessionSettings: {
        identityOptions: sessionIdentityOptions
    }
};

const bbgMarketData: BBGMarketDataAPI = BBGMarketDataFactory(io.interop, bbgLibraryConfig);

// Use the library.
