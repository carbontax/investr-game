function User(user) {
	/*global Game */
	"use strict";
	var self = this;
	self.id = null;
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

	self.loadData = function(user) {
		if ( user ) {
			self.id = user.id;
			self.username(user.username);
			self.loadGames(user.games);
			self.loadNewGames(user.newGames);
		}
	};
	
	self.loadGames = function(games) {
		self.games([]);
		$.each(games, function() {
			self.games.push(new Game(this));
		});
	};
	
	self.loadNewGames = function(newGames) {
		newGames = newGames || [];
		self.newGames([]);
		$.each(newGames, function() {
			self.newGames.push(new Game(this));
		});
	};
	
	self.getGamesPollString = function() {
		var pollString = "";
		$.each(self.activeGames(), function() {
			if ( pollString.length > 0 ) {
				pollString += "-";
			}
			pollString += this.getPollString();
		});
		$.each(self.newGames(), function() {
			if ( pollString.length > 0 ) {
				pollString += "-";
			}
			pollString += this.getPollString();
		});
		return pollString;
	};
	
	// runs on create
	self.loadData(user);
}
