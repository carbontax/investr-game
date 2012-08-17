	function User(user) {
		var self = this;

		self.logged_in = user.logged_in;
		self.username = user.username;
		self.activeGames = ko.observableArray(user.activeGames);
		self.completedGames = ko.observableArray(user.completedGames);

		self.isLoggedIn = function() { 
			return self.logged_in; 
		}
	}
