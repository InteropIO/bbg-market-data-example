import { RequestType } from '@glue42/bbg-market-data/dist/cjs/request-types'

function historicalDataArgs() {
  return {
    'periodicityAdjustment': 'ACTUAL',
    'periodicitySelection': 'MONTHLY',
    'startDate': '20060101',
    'endDate': '20061231',
    'maxDataPoints': 100,
    'returnEids': true,
    'securities': ['IBM US Equity', 'MSFT US Equity'],
    'fields': ['PX_LAST', 'OPEN'],
    'nonTradingDayFillOption': 'NON_TRADING_WEEKDAYS',
    'nonTradingDayFillMethod': 'PREVIOUS_VALUE'
  };
}

function referenceDataArgs() {
  return {
    'securities': ['IBM US Equity', 'MSFT US Equity'],
    'fields': ['PX_LAST', 'OPEN'],
    'returnEids': true,
  };
}

function intraDayBarArgs() {
  return {
    'startDateTime': '2019-02-01',
    'endDateTime': '2019-12-10',
    'eventType': 'TRADE',
    'maxDataPoints': 100,
    'returnEids': true,
    'interval': 60,
    'security': 'IBM US Equity',
  };
}

function instrumentListArgs() {
  return {
    query: 'VOD',
    maxResults: 5
  };
}

function snapshotArgs() {
  return {
    security: 'VOD LN Equity'
  };
}

function fieldSearchArgs() {
  return {
    searchSpec: 'last price'
  };
}

function fieldListArgs() {
  return {
    fieldType: 'RealTime',
    returnFieldDocumentation: true
  };
}

function userEntitlementsArgs() {
  return {
    'uuid': 1000,
    'sid': 5000,
    'securities': 'VOD LN Equity'
  };
}

function marketSubscriptionArgs() {
  return [
    {
      security: 'IBM US Equity',
      fields: ['LAST_PRICE', 'BID', 'ASK', 'BID_YIELD', 'ASK_YIELD']
    },
    {
      security: 'MSFT US Equity',
      fields: ['LAST_PRICE', 'BID', 'ASK', 'BID_YIELD', 'ASK_YIELD']
    }
  ];
}

export function getDefaultArgs(requestType) {
  switch (requestType) {
    case RequestType.MarketSubscription: return marketSubscriptionArgs();
    case RequestType.HistoricalData: return historicalDataArgs();
    case RequestType.ReferenceData: return referenceDataArgs();
    case RequestType.IntraDayBar: return intraDayBarArgs();
    case RequestType.InstrumentList: return instrumentListArgs();
    case RequestType.Snapshot: return snapshotArgs();
    case RequestType.FieldSearch: return fieldSearchArgs();
    case RequestType.FieldList: return fieldListArgs();
    case RequestType.UserEntitlements: return userEntitlementsArgs();

    default:
      throw new Error('Unknown request type ' + requestType);
  }
}

