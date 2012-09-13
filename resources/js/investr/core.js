function InvestrViewModel() {
	var self = this;

	self.title = "Investr";

	self.user = ko.observable();
	self.username = ko.computed(function() {
		if ( self.user() && self.user().username ) {
			return self.user().username;
		}
		return "";
	});

	self.loggedIn = ko.computed(function() {
		if ( self.username() === "" ) {
			return false;
		}
		return true;
	});
	self.notLoggedIn = ko.computed(function() {
		return ! self.loggedIn();
	});

	self.activeGames = ko.computed(function() {
		return self.user() ? self.user().activeGames() : [];
	});

	self.newGames = ko.observableArray();

	self.game = ko.observable();

	self.newGame = ko.observable();

	self.shouldDisplayGamesLists = ko.computed(function() {
		if ( self.notLoggedIn() || self.game() ) {
			return false;
		}
		return true;
	});

	self.allUsernames = ko.observableArray(["carbontax", "peppercorn", "nsmithlea"]);

	self.ajaxFailureCallback = function(xhr) {
			if ( xhr.status === 401 ) {
				self.user(null);
			}
			$('#messages').empty().append(xhr.responseText);
	};

	self.resetLoginForm = function() {
		$('#email', '#login-form').val('');
		$('#password', '#login-form').val('');
	}

	self.submitLoginForm = function() {
		var data = {
			email: $('#email', '#login-form').val(),
			password: $('#password', '#login-form').val()
		}
		$.ajax({
			url: '/investr-game/api/login',
			data: data,
			dataType: 'json',
			type: 'post',
			success: function(data) {
				$('#messages').empty();
//				self.loggedIn(true);
				self.user(new User(data));
			},
			error: self.ajaxFailureCallback
		});
		self.resetLoginForm();
		return false;
	};

	self.getNewGame = function() {
		$.ajax({
			url: '/investr-game/api/games/new',
			type: 'get',
			dataType: 'json',
			success: function(data) {
				self.newGame(new Game(data));
				$('#new-game-form-dialog').modal('toggle');
			},
			error: self.ajaxFailureCallback
		});
	};

	self.cancelNewGame = function() {
		self.newGame(null);
		$('#new-game-form-dialog').modal('toggle');
	}

	self.saveNewGame = function() {
		$.ajax({
			url: '/investr-game/api/games',
			type: 'post',
			dataType: 'json',
			success: function(data) {
				self.game(new Game(data));
				$('#new-game-form-dialog').modal('toggle');
			},
			error: self.ajaxFailureCallback
		});		
	}

	self.mayJoinGame = function(game) {
		return true;
	}

	self.joinGame = function(game) {
		$.ajax({
			url: '/investr-game/api/games/' + game.id + '/join',
			type: 'post',
			dataType: 'json',
			success: function(data) {
				game.players = data.players;
				$('messages').empty().append("You have joined game " + game.id);
			},
			error: self.ajaxFailureCallback
		});				
	}

	self.openGame = function(game) {
		$('#messages').empty();
		$.ajax({
			url: '/investr-game/api/games/' + game.id,
			dataType: 'json',
			type: 'get',
			success: function(data) {
				self.game(new Game(data));
			},
			error: self.ajaxFailureCallback
		});
	}

	self.closeGame = function() {
		self.game(null);
	}

	self.logoutAction = function() {
		self.user(null);
		self.game(null);
		$.ajax({
			url: '/investr-game/api/logout',
			type: 'post',
			success: function() {
				self.user(null);
			}
		});
	}

	self.getNewGames = function() {
		$.ajax({
			url: '/investr-game/api/games/new/list',
			type: 'get',
			dataType: 'json',
			success: function(data) {
				$('#messages').empty();
				$.each(data, function() {
					self.newGames().push(new Game(this));
				});
			},
			error: self.ajaxFailureCallback
		});

	}

	$.ajax({
		url: '/investr-game/api/login',
		type: 'get',
		dataType: 'json',
		success: function(data) {
			$('#messages').empty();
			self.user(new User(data));
			self.getNewGames();
		},
		error: self.ajaxFailureCallback
	});

}