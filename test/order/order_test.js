/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false, ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global Game: false, Order: false, Security: false */
(function($, ko) {
	module('investr#empty_order', {
	});

	test('can create new empty order', 1, function() {
		var order = new Order();
		ok(order, 'It should be possible to create an empty order');
	});
	
}(jQuery, ko));
