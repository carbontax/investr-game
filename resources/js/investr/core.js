var sample_users = [
	{'username': 'googalan', 'logged_in': true, 'activeGames': [1,3,6], 'completedGames': [2,4,5]}, 
	{'username': "carbontax", 'logged_in': false, 'activeGames': [1,3,6], 'completedGames': [2,4,5]}, 
	{'username': "nsmithlea", 'logged_in': false, 'activeGames': [1,3,6], 'completedGames': [2,4,5]}, 
	{'username': "peppercorn", 'logged_in': false, 'activeGames': [1,3,6], 'completedGames': [2,4,5]}
];

// devel mode (http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript)
/*function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}*/

function InvestrViewModel() {
	var self = this;
	// devel mode
//	var gameId = getParameterByName("gameId");

	self.title = "Stock & Bonds";

	self.user = ko.observable();
	self.username = ko.computed(function() {
		if ( self.user() && self.user().username ) {
			return self.user().username;
		}
		return "";
	});

//	self.loggedIn = ko.observable(true); // TODO change this init to false*/
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

	self.game = ko.observable(null);

	self.shouldDisplayGamesLists = ko.computed(function() {
		if ( self.game() ) {
			return false;
		}
		return true;
	});

	self.ajaxFailureCallback = function(xhr) {
			if ( xhr.status === 401 ) {
				self.loggedIn(false);
			}
			$('#messages').empty().append(xhr.responseText);
	};

	$.ajax({
		url: '/investr-api/login',
		type: 'get',
		dataType: 'json',
		success: function(data) {
			$('#messages').empty();
//			self.loggedIn(true);
			self.user(new User(data));
		},
		error: self.ajaxFailureCallback
	});

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
			url: '/investr-api/login',
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

	self.newGame = function() {
		// TODO query server for initial setup
		self.game(new Game(new_game));
	};

	self.openGame = function(game) {
		self.game(game);
	}

	self.closeGame = function() {
		self.game(null);
	}

	self.getGame = function(game) {
		if ( isNaN(game.id) ) {
			throw new Error("Invalid gameId");
		} else {
			var url = "/investr-api/games/" + game.id;
			$.ajax({
				url: url,
				dataType: 'json',
				success: function(game_data) {
					self.game(new Game(game_data, url));
				},
				error: self.ajaxFailureCallback
			});
		}		
	}

/*	try {
		if ( gameId ) {
			self.getGame(gameId);
		} 
	} catch(err) {
		$('#messages').disco_messages('errors', err.message);
		log.info(err.message, err);
	}*/

	self.logoutAction = function() {
		self.user(null);
		self.game(null);
		$.ajax({
			url: '/investr-api/logout',
			type: 'post',
			success: function() {
//				self.loggedIn(false);
				self.user(null);
			}
		});
	}
}