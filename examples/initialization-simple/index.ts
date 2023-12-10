import BBGMarketDataFactory, { BBGMarketDataAPI } from '@glue42/bbg-market-data';
import IOConnect from '@interopio/desktop';

const io = await IOConnect();

const bbgMarketData: BBGMarketDataAPI = BBGMarketDataFactory(io.interop);

// Use the library.
