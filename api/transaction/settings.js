/* eslint-disable valid-jsdoc */
'use strict';
var _ = require('lodash');
var assert = require('assert');
var ripple = require('ripple-lib');
var setTransactionBitFlags = require('./utils').setTransactionBitFlags;
var validate = require('../lib/validate');
var utils = require('./utils');
var InvalidRequestError = require('../lib/errors').InvalidRequestError;
var constants = require('../lib/constants');
var wrapCatch = require('../lib/utils').wrapCatch;

// Emptry string passed to setting will clear it
var CLEAR_SETTING = '';

/**
 * Pad the value of a fixed-length field
 *
 * @param {String} value
 * @param {Number} length
 * @return {String}
 */
function padValue(value, length) {
  assert.strictEqual(typeof value, 'string');
  assert.strictEqual(typeof length, 'number');

  var result = value;

  while (result.length < length) {
    result = '0' + result;
  }

  return result;
}

/**
 * Set integer flags on a transaction based on input and a flag map
 *
 * @param {Transaction} transaction
 * @param {Object} input - Object whose properties determine whether
 *                to update the transaction's SetFlag or ClearFlag property
 * @param {Object} flags - Object that maps property names to transaction
 *                integer flag values
 *
 * @returns undefined
 */
function setTransactionIntFlags(transaction, input, flags) {
  for (var flagName in flags) {
    var flag = flags[flagName];

    if (!input.hasOwnProperty(flag.name)) {
      continue;
    }

    var value = input[flag.name];

    if (value) {
      transaction.tx_json.SetFlag = flag.value;
    } else {
      transaction.tx_json.ClearFlag = flag.value;
    }
  }
}

/**
 * Set fields on a transaction based on input and fields schema object
 *
 * @param {Transaction} transaction
 * @param {Object} input - Object whose properties are used to set fields on
 *                         the transaction
 * @param {Object} fieldSchema - Object that holds the schema of each field
 *
 * @returns undefined
 */
function setTransactionFields(transaction, input, fieldSchema) {
  for (var fieldName in fieldSchema) {
    var field = fieldSchema[fieldName];
    var value = input[field.name];

    if (typeof value === 'undefined') {
      continue;
    }

    // The value required to clear an account root field varies
    if (value === CLEAR_SETTING && field.hasOwnProperty('defaults')) {
      value = field.defaults;
    }

    if (field.encoding === 'hex') {
      // If the field is supposed to be hex, why don't we do a
      //  toString('hex') on it?
      if (field.length) {
        // Field is fixed length, why are we checking here though?
        // We could move this to validateInputs
        if (value.length > field.length) {
          throw new InvalidRequestError(
            'Parameter length exceeded: ' + fieldName);
        } else if (value.length < field.length) {
          value = padValue(value, field.length);
        }
      } else {
        // Field is variable length. Expecting an ascii string as input.
        // This is currently only used for Domain field
        value = new Buffer(value, 'ascii').toString('hex');
      }

      value = value.toUpperCase();
    }

    transaction.tx_json[fieldName] = value;
  }
}

/**
 *  Convert a numerical transfer rate in ripple-rest format to ripple-lib
 *
 *  Note: A fee of 1% requires 101% of the destination to be sent for the
 *        destination to receive 100%.
 *  The transfer rate is specified as the input amount as fraction of 1.
 *  To specify the default rate of 0%, a 100% input amount, specify 1.
 *  To specify a rate of 1%, a 101% input amount, specify 1.01
 *
 *  @param {Number|String} transferRate
 *
 *  @returns {Number|String} numbers will be converted while strings
 *                           are returned
 */
function convertTransferRate(transferRate) {
  if (_.isNumber(transferRate)) {
    return transferRate * Math.pow(10, 9);
  }

  return transferRate;
}

function createSettingsTransaction(account, settings) {
  var transaction = new ripple.Transaction();
  transaction.accountSet(account);

  setTransactionBitFlags(transaction, {
    input: settings,
    flags: constants.AccountSetFlags,
    clear_setting: CLEAR_SETTING
  });
  setTransactionIntFlags(transaction, settings, constants.AccountSetIntFlags);
  setTransactionFields(transaction, settings, constants.AccountRootFields);

  transaction.tx_json.TransferRate = convertTransferRate(
    transaction.tx_json.TransferRate);
  return transaction;
}

function prepareSettings(account, settings, instructions, callback) {
  instructions = instructions || {};
  validate.address(account);
  validate.settings(settings);

  var transaction = createSettingsTransaction(account, settings);
  utils.createTxJSON(transaction, this.remote, instructions, callback);
}

module.exports = {
  prepareSettings: wrapCatch(prepareSettings),
  createSettingsTransaction: createSettingsTransaction
};
