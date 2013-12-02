/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false, ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global Game: false, Holding: false, Security: false */
(function($, ko) {
	module('investr#empty_holding', {
	});

	test('can create new empty holding', 1, function() {
		var holding = new Holding();
		ok(holding, 'It should be possible to create an empty holding');
	});
	
}(jQuery, ko));
