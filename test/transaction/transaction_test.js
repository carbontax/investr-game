/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false, ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global Game: false, Transaction: false, Security: false */
(function($, ko) {
	module('investr#empty_transaction', {
	});

	test('can create new empty transaction', 1, function() {
		var transaction = new Transaction();
		ok(transaction, 'It should be possible to create an empty transaction');
	});
	
}(jQuery, ko));
