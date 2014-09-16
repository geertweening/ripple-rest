var supertest = require('supertest');
var _app = require('../lib/express_app')
var app = supertest(_app)
var ws = require('ws');
var ee = require('events').EventEmitter;
var lib = require('./fixtures')
var assert = require('assert');


var route = new ee;
route.on('ping', lib.ping)
route.on('subscribe', lib.subscribe)
route.on('server_info',lib.server_info)

var rippled = new ws.Server({port: 5150});
rippled.on('connection', lib.connection.bind({route:route}));

_app.remote.once('connect', function() {
  _app.remote.getServer().once('ledger_closed', ready);
});

console.log("Connecting remote")
_app.remote.connect();

function ready() {
    app.get('/v1/server/connected')
    .end(function(err, resp) {
        console.log('resp:', resp.body)
        assert.strictEqual(resp.body.success, true);
    });
}
