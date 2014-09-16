var accounts = {}
accounts.genesis = {
    address:  'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    secret: 'snoPBrXtMeMyMHUVTgbuqAfg1SUTb'
}
accounts.alice = {
    address : 'rJRLoJSErtNRFnbCyHEUYnRUKNwkVYDM7U',
    secret : 'shtfQyMwYqppw6A3hcyhzwLxYaqgE'
}
var payments = {};
payments.genesis_to_alice = {
  "secret": accounts.genesis.secret,
  "client_resource_id": "foobar24",
  "payment": {
    "source_account": accounts.genesis.address,
    "source_tag": "",
    "source_amount": {
    "value": "429",
    "currency": "XRP",
    "issuer": ""
    },
    "source_slippage": "0",
    "destination_account" :accounts.alice.address,
    "destination_tag": "",
    "destination_amount": {
      "value": "429",
      "currency": "XRP",
      "issuer": ""
    }, 
    "invoice_id": "",
    "paths": "[]",
    "no_direct_ripple": false,
    "partial_payment": false,
    "direction": "outgoing",
    "state": "validated",
    "result": "tesSUCCESS",
    "ledger": "6141074",
    "hash": "85C5E6762DE7969DC1BD69B3C8C7387A5B8FCE6A416AA1F74C0ED5D10F08EADD",
    "timestamp": "2014-04-18T01:21:00.000Z",
    "fee": "0.000012",
    "source_balance_changes": 
    [ 
      {
        "value": "-429.000012",
        "currency": "XRP",
        "issuer": ""
      }
    ],
    "destination_balance_changes": 
    [
      {
        "value": "429",
        "currency": "XRP",
        "issuer": ""
      }
    ]
  }
}
exports.payments = payments;
exports.accounts = accounts
var submit = function(data,ws) {
    ws.send(JSON.stringify(
{ id: 4,
  result: 
   { engine_result: 'tesSUCCESS',
     engine_result_code: 0,
     engine_result_message: 'The transaction was applied.',
     tx_blob: '12000022000000002400000001201B0086590E61400000001992054068400000000000000C73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD0207446304402206A14028E66CD2D55D32DF83D3CD507D4ED16818BF88238FA578E54F0CE731B8302202E77B1E3F9856E1B0DB7BD43DA9DD8D4FDCB144C48025D6C0B1BE40C5CB81E3C8114B5F762798A53D543A014CAF8B297CFF8F2F937E88314BF14A5EF6814B074833FDDBA3B2235812EF55ABF',
     tx_json: 
      { Account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
        Amount: '429000000',
        Destination: 'rJRLoJSErtNRFnbCyHEUYnRUKNwkVYDM7U',
        Fee: '12',
        Flags: 0,
        LastLedgerSequence: 8804622,
        Sequence: 1,
        SigningPubKey: '0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020',
        TransactionType: 'Payment',
        TxnSignature: '304402206A14028E66CD2D55D32DF83D3CD507D4ED16818BF88238FA578E54F0CE731B8302202E77B1E3F9856E1B0DB7BD43DA9DD8D4FDCB144C48025D6C0B1BE40C5CB81E3C',
        hash: 'AA067B86C98192D21A8B52235AD4DB7DFB0951E29189ABCF59FF124E649694F5' } },
  status: 'success',
  type: 'response' }
))
};
exports.submit = submit;

var ping = function(data,ws) {
//    console.log("ping!")
    ws.send(JSON.stringify({"id": data.id,"status": "success","type": "response","result": {}}))
}
exports.ping = ping;
var subscribe = function(data,ws) {
    ws.send(JSON.stringify({
    "type": "ledgerClosed",
    "fee_base": 10,
    "fee_ref": 10,
    "ledger_hash": "5CE11F88A44F7DA9D2E092719CEC7920BCE6128428F4549B8F51299648A9511C",
    "ledger_index": 8804615,
    "ledger_time": 463710700,
    "reserve_base": 20000000,
    "reserve_inc": 5000000,
    "txn_count": 17,
    "validated_ledgers": "32570-8804615"}))
}
exports.subscribe = subscribe;
var server_info = function(data,ws) {
    ws.send(JSON.stringify({
    "id": 1,
    "status": "success",
    "type": "response",
    "result": {
    "info": {
      "build_version": "0.26.3-rc2",
      "complete_ledgers": "32570-8803979",
      "hostid": "KEY",
      "io_latency_ms": 1,
      "last_close": {
        "converge_time_s": 2.01,
        "proposers": 0
      },
      "load_factor": 1,
      "peers": 48,
      "pubkey_node": "n9KdXJvZ9YjuDTRLRYuS6isVeKv7C2sehxCnCtg3G6HY2fuvVG2K",
      "server_state": "syncing",
      "validated_ledger": {
        "age": 6,
        "base_fee_xrp": 0.00001,
        "hash": "8AA5B0329BB5A67CD53A5A31700F40D9AA44423DC4ACD598EB3BCBC6D425565D",
        "reserve_base_xrp": 20,
        "reserve_inc_xrp": 5,
        "seq": 8803979
      },
      "validation_quorum": 3
    }}}));
}
exports.server_info = server_info;
var ripple_path_find = function(data,ws) {
    ws.send(JSON.stringify(
        { id: 2,
        result: 
        { alternatives: [],
        destination_account: 'rJRLoJSErtNRFnbCyHEUYnRUKNwkVYDM7U',
        destination_currencies: [ 'XRP' ] },
        status: 'success',
        type: 'response' }
    ))
};
exports.ripple_path_find = ripple_path_find

var account_info = function(data,ws) {
    switch (data.account) {
        case accounts.genesis.address :
            ws.send(JSON.stringify(
            { id: 3,
              result: 
               { account_data: 
                  { Account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
                    Balance: '100000000000000000',
                    Flags: 0,
                    LedgerEntryType: 'AccountRoot',
                    OwnerCount: 0,
                    PreviousTxnID: '0000000000000000000000000000000000000000000000000000000000000000',
                    PreviousTxnLgrSeq: 0,
                    Sequence: 1,
                    index: '2B6AC232AA4C4BE41BF49D2459FA4A0347E1B543A4C92FCEE0821C0201E2E9A8' },
                 ledger_current_index: 5,
                 validated: false },
              status: 'success',
              type: 'response' }
            ))
        break;
        default :
        break;
    }
};
exports.account_info = account_info
var sample_ledger = JSON.stringify({
  "type": "ledgerClosed",
  "fee_base": 10,
  "fee_ref": 10,
  "ledger_hash": "5CE11F88A44F7DA9D2E092719CEC7920BCE6128428F4549B8F51299648A9511C",
  "ledger_index": 8804615,
  "ledger_time": 463710700,
  "reserve_base": 20000000,
  "reserve_inc": 5000000,
  "txn_count": 17,
  "validated_ledgers": "32570-8804615"
})
exports.sample_ledger = sample_ledger

var connection = function(ws) {
    console.log("connection")
    setInterval(function() {
        ws.send(sample_ledger)
    }, 8000)
//    ws.send(sample_ledger)
    ws.send(JSON.stringify({
      id: 0,
      status: 'success',
      type: 'response',
      result: {
        fee_base: 10,
        fee_ref: 10,
        ledger_hash: '1838539EE12463C36F2C53B079D807C697E3D93A1936B717E565A4A912E11776',
        ledger_index: 7053695,
        ledger_time: 455414390,
        load_base: 256,
        load_factor: 256,
        random: 'E56C9154D9BE94D49C581179356C2E084E16D18D74E8B09093F2D61207625E6A',
        reserve_base: 20000000,
        reserve_inc: 5000000,
        server_status: 'full',
        validated_ledgers: '32570-7053695'
      }
    }));
    var onmessage = function(message) {
        console.log('\n\n\nreceived: %s', message);
        var data = JSON.parse(message)
        if (data.command) {
            this.route.emit(data.command, data,ws)
        }
    }
    ws.on('message', onmessage.bind(this));
}
exports.connection = connection;

