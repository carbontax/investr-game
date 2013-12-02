/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false, ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global Game: false, Holding: false, Security: false */
(function($, ko) {
	module('investr#empty_security', {
	});

	test('can create new empty security', 1, function() {
		var security = new Security();
		ok(security, 'It should be possible to create an empty security');
	});
	
}(jQuery, ko));
