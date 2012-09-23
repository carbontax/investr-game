	function User(user) {
		var self = this;
		self.id = user.id;
		self.username = ko.observable();
		self.logged_in = ko.observable();
		self.newGames = ko.observableArray();
		self.games = ko.observableArray();
		self.activeGames = ko.computed(function() {
			return ko.utils.arrayFilter(self.games(), function(game) {
				return game.last_year - game.year() > 0;
			});
		});

		self.completedGames = ko.computed(function() {
			return ko.utils.arrayFilter(self.games(), function(game) {
				return game.last_year - game.year() <= 0;
			});
		});

		if ( user ) {
			// self.logged_in(user.logged_in);
			self.username(user.username);
			$.each(user.games, function() {
				self.games.push(new Game(this));
			});
			$.each(user.newGames, function() {
				self.newGames.push(new Game(this));
			});
		}
	}
