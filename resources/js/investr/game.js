
//function Game(securities, lastYear, players, year) {
function Game(game) {
	var self = this;

	var players = $.map(game.players, function(player) {
		return new Player(player);
	});
	self.players = ko.observableArray(players);

	var securities = $.map(game.securities, function(s) {
		return new Security(s);
	});
	self.securities = ko.observableArray(securities);

	self.year = ko.observable(game.year);
	self.lastYear = game.lastYear;
	self.hasNextYear = ko.computed(function() {
		return self.year() < self.lastYear;
	});
	self.yearLabel = ko.computed(function() {
		if ( self.hasNextYear() ) {
			return "Year " + self.year();
		} else {
			return "Game Over";
		}
	});

	self.adjustPrices = function(roll, market) {
		for ( var index in self.securities() ) {
			self.securities()[index].adjustPrice(roll, market);
		}
	}

	self.incrementYear = function() {
		$.disco_clear_messages();
		if ( self.hasNextYear() ) {
			var thisYear = self.year();
			try { 
				if ( isNaN(self.year()) || self.year() < 1 ) {
					throw new Error("Illegal current year value");
				}
				self.year(thisYear + 1);
				self.adjustPrices(6, 'bear');
			} catch (err) {
				$('#messages').disco_messages('errors', err.message);
				log.error(err);
			}
		}
	};

};
