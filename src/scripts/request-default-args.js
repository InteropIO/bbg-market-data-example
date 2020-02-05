import { RequestType } from '@glue42/bbg-market-data/dist/cjs/request-types'

function historicalDataArgs() {
  return {
    securities: ['IBM US Equity', 'MSFT US Equity'],
    fields: ['PX_LAST', 'OPEN'],
    startDate: "20060101",
    endDate: '20061231'
  };
}

function referenceDataArgs() {
  return {
    securities: ['IBM US Equity'],
    fields: ['PX_LAST', 'OPEN'],
    startDate: "20060101",
    endDate: '20061231'
  };
}

function intraDayBarArgs() {
  return {
    security: 'IBM US Equity',
    startDateTime: '20060101',
    endDateTime: '20061231',
    eventType: 'TRADE',
    maxDataPoints: 100,
    returnEids: true
  };
}

function instrumentListArgs() {
  return {
    query: 'VOD',
    maxResults: 10
  };
}

function snapshotArgs() {
  return {
    security: 'VOD LN Equity'
  };
}

function fieldSearchArgs() {
  return {
    fieldType: 'RealTime',
    returnFieldDocumentation: true
  };
}

function userEntitlementsArgs() {
  return {
    uuid: 1000
  };
}

function marketSubscriptionArgs() {
  return [
    {
      security: 'IBM US Equity',
      fields: ['LAST_PRICE']
    },
    {
      security: 'MSFT US Equity',
      fields: ['LAST_PRICE']
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
    case RequestType.UserEntitlements: return userEntitlementsArgs();

    default:
      throw new Error('Unknown request type ' + requestType);
  }
}

