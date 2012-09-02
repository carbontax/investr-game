	function User(user) {
		var self = this;

		self.username = ko.observable();
		self.logged_in = ko.observable();
		self.activeGames = ko.observableArray();
		self.completedGames = ko.observableArray();

		if ( user ) {
			self.logged_in(user.logged_in);
			self.username(user.username);
			$.each(user.activeGames, function() {
				var activeGame = this;
				self.activeGames.push(new Game(activeGame));
			});
			self.completedGames(user.completedGames);
		}
	}
