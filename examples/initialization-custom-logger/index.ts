import BBGMarketDataFactory, { BBGMarketDataAPI, BBGMarketDataConfig, Logger } from '@glue42/bbg-market-data';
import IOConnect from '@interopio/desktop';

const io = await IOConnect();

// For the sake of this example, we will use an io.Connect Logger. 
// However, any implementation of the Logger interface (from @glue42/bbg-market-data) is accepted. 
const ioLogger = io.logger.subLogger('bbg-mkt-data-custom-logger');
io.logger.consoleLevel('info');
io.logger.publishLevel('info');

const bbgLibraryConfig: BBGMarketDataConfig = {
    debug: true, // Enables logging
    logger: ioLogger
};

const bbgMarketData: BBGMarketDataAPI = BBGMarketDataFactory(io.interop, bbgLibraryConfig);

// Use the library.
