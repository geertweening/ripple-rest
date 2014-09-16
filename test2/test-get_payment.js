var supertest = require('supertest');
var _app = require('../lib/express_app')
var app = supertest(_app)
var assert = require('assert')
var ws = require('ws');
var ee = require('events').EventEmitter;
var lib = require('./fixtures')

var route = new ee;
route.on('ping', lib.ping)
route.on('subscribe', lib.subscribe)
route.on('server_info',lib.server_info)

route.on('account_info', lib.account_info)
route.on('ripple_path_find',lib.ripple_path_find)
route.on('submit',lib.submit)

var rippled = new ws.Server({port: 5150});
rippled.on('connection', lib.connection.bind({route:route}))

_app.remote.once('connect', function() {
  _app.remote.getServer().once('ledger_closed', ready);
});

console.log("Connecting remote")
_app.remote.connect();

function ready() {
    // get a XRP PATH from genesis to alice
    app.get('/v1/accounts/'+lib.accounts.genesis.address+'/payments/paths/'+lib.accounts.alice.address+'/429+XRP')
    .end(function(err, resp) {
        console.log(resp.status, resp.body)
        assert.strictEqual(resp.body.success, true);
    })
    // post a XRP payment from genesis to alice
    app.post('/v1/payments')
    .send(lib.payments.genesis_to_alice)
    .end(function(err,resp) {
        console.log(resp.status, resp.body)
        assert.strictEqual(resp.body.success, true);
        _app.remote.disconnect()
        console.log("Going to close")
        rippled.close(function(resp) {
            console.log("ws close resp:", resp)
        });
    })
}
