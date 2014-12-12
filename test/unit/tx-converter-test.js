var assert            = require('assert');
var fixtures          = require('./fixtures').txConverter;
var addresses         = require('./../fixtures').addresses;
var txToRestConverter = require('./../../lib/tx-to-rest-converter.js');

suite('unit - converter - Tx to Rest', function() {

  test('parsePaymentFromTx()', function(done) {
    var tx = fixtures.paymentTx;
    var options = {
      account: addresses.VALID
    };

    txToRestConverter.parsePaymentFromTx(tx, options, function(err, payment) {
      assert.strictEqual(err, null);
      assert.deepEqual(payment, fixtures.paymentRest);
      done();
    });

  });

  test('parsePaymentsFromPathFind()', function(done) {
    var pathFindResults = fixtures.pathFindResultsTx;

    txToRestConverter.parsePaymentsFromPathFind(pathFindResults, function(err, payments) {
      assert.strictEqual(err, null);
      assert.deepEqual(payments, fixtures.pathPaymentsRest);
      done();
    });

  });

  test('parseCancelOrderFromTx()', function(done) {
    var txMessage = fixtures.cancelOrderTx;
    var meta = {
      hash: '3fc6fe4050075aa3115f212b64d97565ccd8003412f6404478a256b2f48351f3',
      ledger: '8819996',
      state: 'validated'
    };

    txToRestConverter.parseCancelOrderFromTx(txMessage, meta, function(err, orderObj) {
      assert.strictEqual(err, null);
      assert.deepEqual(orderObj, fixtures.cancelOrderResponseRest);
      done();
    });

  });

  test('parseSubmitOrderFromTx()', function(done) {
    var txMessage = fixtures.submitOrderResponseTx;
    var meta = {
      hash: '684fd723577624f4581fd35d3ada8ff9e536f0ce5ab2065a22adf81633be1f2c',
      ledger: '8819982',
      state: 'pending'
    };

    txToRestConverter.parseSubmitOrderFromTx(txMessage, meta, function(err, orderObj) {
      assert.strictEqual(err, null);
      assert.deepEqual(orderObj, fixtures.submitOrderResponseRest);
      done();
    });

  });

  test('parseTrustResponseFromTx()', function(done) {
    var txMessage = fixtures.trustResponseTx;
    var meta =  {
      hash: '0F480D344CFC610DFA5CAC62CC1621C92953A05FE8C319281CA49C5C162AF40E',
      ledger: '8820111',
      state: 'validated'
    };

    txToRestConverter.parseTrustResponseFromTx(txMessage, meta, function(err, trustObj) {
      assert.strictEqual(err, null);
      assert.deepEqual(trustObj, fixtures.trustResponseRest);
      done();
    });

  });

  test('parseSettingResponseFromTx()', function(done) {
    var params = {
      account: addresses.VALID,
      secret: addresses.SECRET,
      settings: {
        require_destination_tag: true,
        require_authorization: true,
        disallow_xrp: true,
        domain: 'example.com',
        email_hash: '23463B99B62A72F26ED677CC556C44E8',
        wallet_locator: 'DEADBEEF',
        wallet_size: 1,
        transfer_rate: 2,
        no_freeze: false,
        global_freeze: true
      }
    };

    var txMessage = fixtures.settingResponseTx;
    var meta = {
      account: addresses.VALID
    };

    txToRestConverter.parseSettingResponseFromTx(params, txMessage, meta, function(err, settingObj) {
      assert.strictEqual(err, null);
      assert.deepEqual(settingObj, fixtures.settingResponseRest);
      done();
    });

  });

  test('parseFlagsFromResponse()', function(done) {
    var responseFlags = 2147614720;
    var flags = {
      NoRipple: {
        name: 'prevent_rippling',
        value: 131072
      },
      SetFreeze: {
        name: 'account_trustline_frozen',
        value: 1048576
      },
      SetAuth: {
        name: 'authorized',
        value: 65536
      }
    };

    var parsedFlags = txToRestConverter.parseFlagsFromResponse(responseFlags, flags);

    assert.deepEqual(parsedFlags, {
      prevent_rippling: true,
      account_trustline_frozen: false,
      authorized: false
    });

    done();
  });

});