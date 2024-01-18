import BBGMarketDataFactory, { BBGMarketDataAPI, BBGMarketDataConfig, FieldType, SessionOptions } from '@glue42/bbg-market-data';
import IOConnect from '@interopio/desktop';

const io = await IOConnect();

const bbgLibraryConfig: BBGMarketDataConfig = {
    debug: true, // Enables logging
};

const bbgMarketData: BBGMarketDataAPI = BBGMarketDataFactory(io.interop, bbgLibraryConfig);

// Creating 
const largeDataVolumeSession = await bbgMarketData.sessions.create({
    options: {
        // ...
    },
    identityOptions: {
        // ...
    }
});

const req = bbgMarketData.createFieldListRequest({ fieldType: FieldType.Static });

req.onData((data) => {
    // Handle Data 
})

await req.open({
    session: largeDataVolumeSession
});

// ...
