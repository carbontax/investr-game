/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global User: false*/
(function($, ko) {
	module('investr#user_standalone', {
	});

	test('new User is not logged in', 1, function() {
		var data = {};
		var user = new User();
		equal(user.isLoggedIn(), false, 'User should not be logged in');
	});

	test('empty object is not logged in user', 1, function() {
		var data = {};
		var user = new User(data);
		equal(user.isLoggedIn(), false, 'User should not be logged in');
	});

	test('user with no games is logged in', 1, function() {
		var data = {id: 1, username: 'test_user_1'};
		var user = new User(data);
		ok(user.isLoggedIn(), 'User should be logged in');
	});
	
}(jQuery, ko));
