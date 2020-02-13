import { RequestType } from '@glue42/bbg-market-data/dist/cjs/request-types'

export const editorOptions = {
  mode: 'code',
  modes: ['code', 'form', 'text', 'tree', 'view', 'preview'],
  onError: function (err) {
    alert(err.toString())
  },
}

export function createRequest(lib, type, args) {
  switch (type) {
    case RequestType.MarketSubscription: return lib.createMarketDataRequest(args)
    case RequestType.HistoricalData: return lib.createHistoricalDataRequest(args)
    case RequestType.ReferenceData: return lib.createReferenceDataRequest(args)
    case RequestType.IntraDayBar: return lib.createIntraDayBarRequest(args)
    case RequestType.InstrumentList: return lib.createInstrumentListRequest(args)
    case RequestType.Snapshot: return lib.createSnapshotRequest(args)
    case RequestType.FieldSearch: return lib.createFieldSearchRequest(args)
    case RequestType.FieldList: return lib.createFieldListRequest(args)
    case RequestType.UserEntitlements: return lib.createUserEntitlementsRequest(args)

    default:
      throw new Error('Unknown request type ' + type);
  }
}

export function fillRequestTypeOptions(select) {
  const requestTypes = Object.keys(RequestType).map((key) => RequestType[key]);

  requestTypes.forEach((type, ind) => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    if (ind === 0) {
      opt.defaultSelected = true;
    }
    select.appendChild(opt);
  });
}
