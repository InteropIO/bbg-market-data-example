export const initializeInstrumentListSearchProvider = async (io, bbgMarketData) => {
    console.log('Instrument List Search Provider starting...');

    if (io.search == null) {
        console.warn('IO Search API is not initialized.');
        return;
    }

    const requestPerQuery = new Map();

    const searchProvider = await io.search.registerProvider({
        name: 'bbg-mkt-data-example'
    });

    searchProvider.onQuery(function newSearchQueryHandler(query) {
        console.log('### new query: ', query)

        const request = bbgMarketData.createInstrumentListRequest({
            query: query.search,
            maxResults: 1000
        });

        requestPerQuery.set(query.id, request);

        request.onData(function requestDataHandler({ data, isLast }) {
            console.log('### BBG MDF request\'s data', data, isLast)

            for (const { security, description } of data) {
                query.sendResult({
                    type: {
                        name: 'bbg-instrument-details',
                        displayName: 'Bloomberg Instrument Details'
                    },
                    id: security, // ?? Not sure.
					displayName: security,
                    description: description
                });
            }

            if (isLast) {
                // Clean up.
                query.done();
                requestPerQuery.delete(query.id);
            }
        });

        request.onError(function requestErrorHandler(error) {
            console.error('### BBG MDF request error', error)

            let errorMessage;
            if (error instanceof BloombergError) {
                errorMessage = `Received Bloomberg event message ${error.eventMessage}`;
            } else {
                errorMessage = error.message ?? 'Unknown error';
            }

            query.error(errorMessage);

            // Clean up.
            requestPerQuery.delete(query.id);
        });

        request.open({ aggregateResponse: false }).catch(console.error);
    });

    searchProvider.onQueryCancel(function queryCancelledHandler(query) {
        const request = requestPerQuery.get(query.id);
        if (!request) {
            return;
        }

        // Clean up.
        request.close();
        requestPerQuery.delete(query.id)
    });
}