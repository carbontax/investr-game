/*jslint todo: true, white: true */
/*global User: false, Game: false */
function InvestrViewModel() {
	"use strict";
	var self = this;
	var stopPollingUserFlag = false;
	var stopPollingGameFlag = false;

	self.title = "Investr";

	self.user = ko.observable(new User());
	self.username = ko.computed(function () {
		if (self.user() && self.user().username) {
			return self.user().username;
		}
		return "";
	});
	
	self.showLoginForm = ko.observable(false);
	
	self.loggedIn = ko.computed(function () {
		if (self.username() === "") {
			return false;
		}
		return true;
	});
	self.notLoggedIn = ko.computed(function () {
		return ! self.loggedIn();
	});
	self.enableLoginButton = ko.observable(true);

	self.game = ko.observable();
	self.gameTitle = ko.computed(function () {
		if (self.game()) {
			return self.title + "." + self.game().id + " Year " + self.game().year();
		}
		return self.title;
	});

	self.newGame = ko.observable();

	self.shouldDisplayGamesLists = ko.computed(function () {
		if (self.notLoggedIn() || self.game()) {
			return false;
		}
		return true;
	});

	self.ajaxFailureCallback = function (xhr) {
		if (xhr.status === 401) {
			self.user(new User());
		}
		$('#messages').addClass("alert alert-error").append(xhr.responseText);
	};

	function resetLoginForm() {
		$('#email', '#login-form').val('');
		$('#password', '#login-form').val('');
		self.showSpinner(false);
		self.enableLoginButton(true);
	}

	self.getNewGame = function () {
		// TODO this is unused 
		// get game defaults from server
		$.ajax({
			url: '/investr-game/api/games/new',
			type: 'get',
			dataType: 'json',
			success: function (data) {
				self.newGame(data);
				$('#new-game-form-dialog').modal('toggle');
			},
			error: self.ajaxFailureCallback
		});
	};

	self.cancelNewGame = function () {
		// unused
		self.newGame(null);
		$('#new-game-form-dialog').modal('toggle');
	};

	self.saveNewGame = function () {
		// unused
		$.ajax({
			preventDefault: true,
			url: '/investr-game/api/games',
			type: 'post',
			data: self.newGame(),
			dataType: 'json',
			success: function (data) {
				self.user().newGames.push(new Game(data));
				$('#new-game-form-dialog').modal('toggle');
			},
			error: function (xhr) {
				$('#new-game-form-dialog').modal('toggle');
				self.ajaxFailureCallback(xhr);
			}
		});		
	};

	self.mayJoinGame = function (game) {
		return game.playerCount() < game.number_of_players();
	};

	self.joinGame = function (game) {
		$.ajax({
			url: '/investr-game/api/games/' + game.id + '/join',
			type: 'post',
			dataType: 'json',
			success: function (data) {
				// TODO use ko.observableArray()
				window.location.reload();
			},
			error: self.ajaxFailureCallback
		});				
	};

	self.openGame = function (game) {
		$.ajax({
			url: '/investr-game/api/games/' + game.id,
			dataType: 'json',
			type: 'get',
			success: function (data) {
				self.game(new Game(data));
				startPollingGame();
			},
			error: self.ajaxFailureCallback
		});
	};
	
	self.logoutAction = function () {
		stopAllPolling();
		self.user(new User());
		self.game(null);
		$.ajax({
			url: '/investr-game/api/logout',
			type: 'post',
			success: function () {
				resetLoginForm();
				self.showLoginForm(true);
			}
		});
	};
	
	self.showSpinner = ko.observable(false);
	
	// GAME POLLING
	var startPollingGame = function () {
		stopPollingGameFlag = false;
		stopPollingUserFlag = true;
		pollGame();
	};

	self.pollGameDelay = ko.observable(30000);
	var pollGame = function () {
		if (stopPollingGameFlag) {
			return false;
		}
		var pollString = self.game().getPollString();
		log.debug("pollGame: " + pollString);
		$.ajax({
			url: '/investr-game/api/games/' + self.game().id + '/poll',
			type: 'post',
			data: {'gs': pollString},
			dataType: 'json',
			success: function (data) {
				if (data) {
					self.game().loadGame(data);
				}
			},
			error: function (xhr) {
				log.debug("ERROR POLLING GAME");
			},
			complete: function () {
				setTimeout(pollGame, self.pollGameDelay());
			},
			timeout: 30000
		});
	};

	// USER POLLING
	var startPollingUser = function () {
		stopPollingUserFlag = false;
		stopPollingGameFlag = true;
		pollUser();
	};
	
	self.pollUserDelay = ko.observable(30000);
	var pollUser = function () {
		if (stopPollingUserFlag) {
			return false;
		}
		var pollString = self.user().getGamesPollString();
		log.debug("pollUser: " + pollString);
		$.ajax({
			url: '/investr-game/api/users/poll',
			type: 'post',
			data: {'gs': pollString},
			dataType: 'json',
			success: function (data) {
				if (data) {
					self.user().loadData(data);
				}
			},
			error: function (xhr) {
				stopPollingUserFlag = true;
				self.showLoginForm(true);
				self.ajaxFailureCallback(xhr);
			},
			complete: function () {
				setTimeout(pollUser, self.pollUserDelay());
			},
			timeout: 30000
		});
	};
	
	var stopAllPolling = function () {
		stopPollingGameFlag = true;
		stopPollingUserFlag = true;
	};
	
	self.viewAllGames = function () {
		self.game(null);
		startPollingUser();
	};

	self.submitLoginForm = function () {
		self.enableLoginButton(false);
		self.showSpinner(true);
		var data = {
			email: $('#email', '#login-form').val(),
			password: $('#password', '#login-form').val()
		};
		$.ajax({
			url: '/investr-game/api/login',
			data: data,
			dataType: 'json',
			type: 'post',
			success: function (data) {
				self.showLoginForm(false);
				resetLoginForm();
				self.user().loadData(data);
				startPollingUser();
			},
			error: function (xhr) {
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
	
	// START POLLING ON PAGE LOAD
	pollUser();
}