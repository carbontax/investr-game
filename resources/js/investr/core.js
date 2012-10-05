function InvestrViewModel() {
	var self = this;
	self.clearMessages = function() {
		// TODO remove in favour of bootstrapGrowl
		$('#messages').empty()
		.removeClass("alert")
		.removeClass("alert-success")
		.removeClass("alert-error");
	}

	self.title = "Investr";

	self.user = ko.observable(new User());
	self.username = ko.computed(function() {
		if ( self.user().username ) {
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
				self.user().loadData(data);
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
		// TODO this is unused 
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
		// unused
		self.newGame(null);
		$('#new-game-form-dialog').modal('toggle');
	}

	self.saveNewGame = function() {
		// unused
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
				self.stopPollingUser = true;
				self.game(new Game(data));
				self.stopPollingGame = false;
				self.pollGame();
			},
			error: self.ajaxFailureCallback
		});
	}
	
//	self.reloadUser = function() {
//		self.clearMessages();
//		$.ajax({
//			url: '/investr-game/api/login',
//			type: 'get',
//			dataType: 'json',
//			success: function(data) {
//				self.user().loadData(data);
//				self.game(null);
//			},
//			error: self.ajaxFailureCallback
//		});
//	};
	self.viewAllGames = function() {
		self.stopPollingGame = true;
		self.game(null);
		self.stopPollingUser = false;
		self.pollUser();
	}

	self.logoutAction = function() {
		self.user(null);
		self.game(null);
		$.ajax({
			url: '/investr-game/api/logout',
			type: 'post',
			success: function() {
				self.user(new User());
				self.showLoginForm(true);
			}
		});
	}
	
	self.showSpinner = ko.observable(false);
	
	// GAME POLLING
	self.stopPollingGame = false;
	self.pollGameDelay = ko.observable(30000);
	self.pollGame = function() {
		if ( self.stopPollingGame ) {
			return false;
		}
		var pollString = self.game().getPollString();
		console.log("pollGame: " + pollString);
		$.ajax({
			url: '/investr-game/api/games/' + self.game().id + '/poll',
			type: 'post',
			data: {'gs': pollString},
			dataType: 'json',
			success: function(data) {
				if ( data ) {
					self.game().loadGame(data);
				}
			},
			error: function(xhr) {
				window.console && console.log("ERROR POLLING GAME");
			},
			complete: function() {
				setTimeout(
					self.pollGame,
					self.pollGameDelay()
				);
			},
			timeout: 30000
		});
	};

	// USER POLLING
	self.stopPollingUser = false;
	self.pollUserDelay = ko.observable(30000);
	self.pollUser = function() {
		if ( self.stopPollingUser ) {
			return false;
		}
		var pollString = self.user().getGamesPollString();
		console.log("pollUser: " + pollString);
		$.ajax({
			url: '/investr-game/api/users/poll',
			type: 'post',
			data: {'gs': pollString},
			dataType: 'json',
			success: function(data) {
				if ( data ) {
					self.user().loadData(data);
				}
			},
			error: function(xhr) {
				self.showLoginForm(true);
				self.ajaxFailureCallback(xhr);
			},
			complete: function() {
				setTimeout(
					self.pollUser,
					self.pollUserDelay()
				);
			},
			timeout: 30000
		});
	};
	
	self.pollUser();

/*	(function poll(){
	    $.ajax({ url: "server", success: function(data){
	        //Update your dashboard gauge
	        salesGauge.setValue(data.value);

	    }, dataType: "json", complete: poll, timeout: 30000 });
	})(); */
	
/*	self.init = function() {
		// Runs on page load
		$.ajax({
			url: '/investr-game/api/login',
			type: 'get',
			dataType: 'json',
			success: function(data) {
				self.user().loadData(data);
			},
			error: function(xhr) {
				self.showLoginForm(true);
				self.ajaxFailureCallback(xhr);
			}
		});
	}; */
	
//	self.init();
}

//$(".players-summary").popover({trigger: 'mouseover'});
