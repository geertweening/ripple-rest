/**
 * Against a given ledger state, write against rippled
 * write requests and copy responses for rippled simulation
 */
var WebSocket = require('ws');
var ee = require('events').EventEmitter;
var router = new ee;
var url = 'ws://127.0.0.1:5006';
var ws = new WebSocket(url);

ws.on('open', function() {
    ws.send(JSON.stringify(
{"command":"submit","id":4,"tx_blob":"12000022000000002400000001201B0086590E61400000001992054068400000000000000C73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD0207446304402206A14028E66CD2D55D32DF83D3CD507D4ED16818BF88238FA578E54F0CE731B8302202E77B1E3F9856E1B0DB7BD43DA9DD8D4FDCB144C48025D6C0B1BE40C5CB81E3C8114B5F762798A53D543A014CAF8B297CFF8F2F937E88314BF14A5EF6814B074833FDDBA3B2235812EF55ABF"}

    ))
});

ws.on('message', function(data, flags) {
    console.log(data)
    var data = JSON.parse(data);
    console.log(data.type)
    if (data.type) 
        router.emit(data.type,data)
});

router.on('response',function(data) {
    console.log("\n** response **\n")
    console.log(data)
});

router.on('serverStatus', function(data) {
    console.log("\n** serverStatus **\n")
    console.log(data);
});

router.on('ledgerClosed',function(data) {
    console.log("\n** ledgerClosed **\n")
    ws.send(JSON.stringify({
        "command": "ledger",
        "ledger_hash": data.ledger_hash
    }))
});