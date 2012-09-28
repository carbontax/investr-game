function User(user) {
	var self = this;
	self.id;
	self.username = ko.observable();
//	self.logged_in = ko.observable();
	self.newGames = ko.observableArray();
	self.games = ko.observableArray();
	
	self.activeGames = ko.computed(function() {
		return ko.utils.arrayFilter(self.games(), function(game) {
			return game.hasNextYear();
		});
	});

	self.completedGames = ko.computed(function() {
		return ko.utils.arrayFilter(self.games(), function(game) {
			return ! game.hasNextYear();
		});
	});

	self.loadUser = function(user) {
		if ( user ) {
			self.id = user.id;
			self.username(user.username);
			self.loadGames(user.games);
			self.loadNewGames(user.newGames);
		}
	}
	
	self.loadGames = function(games) {
		self.games([]);
		$.each(games, function() {
			self.games.push(new Game(this));
		});
	}
	
	self.loadNewGames = function(newGames) {
		self.newGames([]);
		$.each(newGames, function() {
			self.newGames.push(new Game(this));
		});
	}
	
	// runs on create
	self.loadUser(user);
}
