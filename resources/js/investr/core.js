function InvestrViewModel() {
	var self = this;
	self.clearMessages = function() {
		$('#messages').empty()
		.removeClass("alert")
		.removeClass("alert-success")
		.removeClass("alert-error");
	}

	self.title = "Investr";

	self.user = ko.observable();
	self.username = ko.computed(function() {
		if ( self.user() && self.user().username ) {
			return self.user().username;
		}
		return "";
	});
	
	self.showLoginForm = ko.observable(false);
	
	self.loggedIn = ko.computed(function() {
		if ( self.username() === "" ) {
			return false;
		}
		return true;
	});
	self.notLoggedIn = ko.computed(function() {
		return ! self.loggedIn();
	});
	self.enableLoginButton = ko.observable(true);

	self.activeGames = ko.computed(function() {
		return self.user() ? self.user().activeGames() : [];
	});
	
	self.completedGames = ko.computed(function() {
		return self.user() ? self.user().completedGames() : [];
	});

	self.newGames = ko.computed(function() {
		return self.user() ? self.user().newGames() : [];
	});

	self.game = ko.observable();
	self.gameTitle = ko.computed(function() {
		if ( self.game() ) {
			return self.title + "." + self.game().id + " Year " + self.game().year();
		}
		return self.title;
	});

	self.newGame = ko.observable();

	self.shouldDisplayGamesLists = ko.computed(function() {
		if ( self.notLoggedIn() || self.game() ) {
			return false;
		}
		return true;
	});

	self.ajaxFailureCallback = function(xhr) {
			self.clearMessages();
			if ( xhr.status === 401 ) {
				self.user(null);
			}
			$('#messages').addClass("alert alert-error").append(xhr.responseText);
	};

	self.resetLoginForm = function() {
		$('#email', '#login-form').val('');
		$('#password', '#login-form').val('');
	}

	self.submitLoginForm = function() {
		self.clearMessages();
		self.enableLoginButton(false);
		self.showSpinner(true);
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
				self.showLoginForm(false);
				self.resetLoginForm();
				self.showSpinner(false);
				self.enableLoginButton(true);
				self.user(new User(data));
			},
			error: function(xhr) {
				self.showSpinner(false);
				self.enableLoginButton(true);
//				self.ajaxFailureCallback(xhr);
				$.bootstrapGrowl(xhr.responseText, {
					type: 'error',
					align: 'center'
				});
			}
		});
		return false;
	};

	self.getNewGame = function() {
		// get game defaults from server
		$.ajax({
			url: '/investr-game/api/games/new',
			type: 'get',
			dataType: 'json',
			success: function(data) {
				self.newGame(data);
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
			preventDefault: true,
			url: '/investr-game/api/games',
			type: 'post',
			data: self.newGame(),
			dataType: 'json',
			success: function(data) {
				self.user().newGames.push(new Game(data));
				$('#new-game-form-dialog').modal('toggle');
			},
			error: function(xhr) {
				$('#new-game-form-dialog').modal('toggle');
				self.ajaxFailureCallback(xhr);
			}
		});		
	}

	self.mayJoinGame = function(game) {
		return game.playerCount() < game.number_of_players();
	}

	self.joinGame = function(game) {
		self.clearMessages();
		$.ajax({
			url: '/investr-game/api/games/' + game.id + '/join',
			type: 'post',
			dataType: 'json',
			success: function(data) {
				// TODO use ko.observableArray()
				window.location.reload();
			},
			error: self.ajaxFailureCallback
		});				
	}

	self.openGame = function(game) {
		self.clearMessages();
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
	
	self.viewAllGames = function() {
		self.clearMessages();
		$.ajax({
			url: '/investr-game/api/login',
			type: 'get',
			dataType: 'json',
			success: function(data) {
				self.user().loadUser(data);
				self.game(null);
			},
			error: self.ajaxFailureCallback
		});
	};

	self.logoutAction = function() {
		self.user(null);
		self.game(null);
		$.ajax({
			url: '/investr-game/api/logout',
			type: 'post',
			success: function() {
				self.user(null);
				self.showLoginForm(true);
			}
		});
	}
	
	self.showSpinner = ko.observable(false);

	self.init = function() {
		// Runs on page load
		$.ajax({
			url: '/investr-game/api/login',
			type: 'get',
			dataType: 'json',
			success: function(data) {
				self.user(new User(data));
			},
			error: function(xhr) {
				self.showLoginForm(true);
				self.ajaxFailureCallback(xhr);
			}
		});
	};
	
	self.init();
}

//$(".players-summary").popover({trigger: 'mouseover'});
