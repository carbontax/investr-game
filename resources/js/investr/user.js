	function User(user) {
		var self = this;
		self.id = user.id;
		self.username = ko.observable();
		self.logged_in = ko.observable();
		self.newGames = ko.observableArray();
		self.activeGames = ko.observableArray();
		self.completedGames = ko.observableArray();

		if ( user ) {
			// self.logged_in(user.logged_in);
			self.username(user.username);
			$.each(user.activeGames, function() {
				//var activeGame = this;
				self.activeGames.push(new Game(this));
			});
			$.each(user.newGames, function() {
				self.newGames.push(new Game(this));
			});
			self.completedGames(user.completedGames);
		}
	}
