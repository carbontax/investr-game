
//function Game(securities, last_year, players, year) {
function Game(game) {
	var self = this;

	// SETTINGS
	self.settings = game.settings;

	self.initial_balance = ko.observable(game.initial_balance);

	self.number_of_players = ko.observable(game.number_of_players);

	// 
	self.id = game.id ? game.id : null;
	self.idFmt = function() {
		if ( self.id === null ) {
			return "Unsaved Game";
		}
		return "Game ID: " + self.id;
	}

	self.start_date = game.start_date;
	self.startDateFmt = ko.computed(function() {
		// TODO 
		return self.start_date;
	});

	self.securities = ko.observableArray();
	if ( game.securities && game.securities.length > 0 ) {
		self.securities($.map(game.securities, function(s) {
			return new Security(s);
		}));
	}

	self.year = ko.observable(game.year);
	self.last_year = game.last_year;
	self.hasNextYear = ko.computed(function() {
		return self.year() < self.last_year;
	});
	self.yearFmt = ko.computed(function() {
		if ( self.hasNextYear() ) {
			return "Year " + self.year();
		} else {
			return "Game Over";
		}
	});

	self.players = game.players;
	self.playerCount = ko.computed(function() {
		return self.players.length;
	});

	self.other_players = ko.observableArray();

	if ( game.other_players && game.other_players.length > 0 ) {
	 	self.other_players($.map(game.other_players, function(player) {
			return new Player(player, self);
		}));
	}

	self.player = ko.observable();
	if ( game.player && game.player.user_id ) {
		self.player(new Player(game.player, self));
	}

	self.turn = game.turn;
	self.turnFmt = ko.computed(function() {
		if (self.turn) {
			return "Done";
		}
		return "Waiting";
	});

	// ORDERS 
	self.orders = ko.observableArray([new Order(this)]);

	self.newOrder = function() {
		self.orders.push(new Order(this));
	};

	self.sendOrders = function() {
		var data = ko.toJSON({orders: self.orders}); 

		$.ajax("/investr-api/games/" + self.id + "/orders", {
			type: 'post',
			contentType: 'application/json',
			data: data,
			success: function(responseText) {
				$('messages').append(responseText);
			},
			error: function(xhr) {
				$('#messages').append(xhr.responseText);
			}
		}); 
	
	}

	self.ordersAccountCash = ko.computed(function() {
		var cash = null;
		if ( self.player() ) {
			cash = self.player().balance();
			$.each(self.orders(), function() {
				if ( this.amount() ) {
					cash += this.amount();
				}
			});
		}
		return cash;
	});

	self.ordersAccountCashFmt = ko.computed(function() {
		return accounting.formatMoney(self.ordersAccountCash());
	});

	self.ordersIncome = ko.computed(function() {
		return 0;
	});

	self.ordersIncomeFmt = function() {
		return accounting.formatMoney(self.ordersIncome());
	};

	self.ordersNetFmt = ko.computed(function() {
		return accounting.formatMoney(self.ordersAccountCash() + self.ordersIncome());
	});

	self.projectedPortfolio = ko.computed(function() {
		// This is a hack and it doesn't update anyway. Fix it.
		if ( self.player() ) {
			var p = self.player().portfolio.slice(0); // copy portfolio
			$.each(self.orders(), function(i, order) {
				var success = false;
				if (order && order.security && order.security() && order.security().symbol) {
					p = $.map(p, function(h) {
						if ( h.symbol === order.security().symbol) {
							h.shares += parseInt(order.shares());
							success = true;
						}
						return h;
					});
					// if ( ! success ) {
					// 	console.log("no success");
					// 	p.push(new Holding(order, self));
					// }
				}
			});
			return p;
		}
	});

	self.groShares = ko.computed(function() {
		// var portfolioShares = 0;
		// if ( self.player() ) {
		// 	($.map(self.player().portfolio, function(h) {
		// 		return h.security.symbol == 'GRO';
		// 	})).shares;
		// }

		var orderShares = 0;
		// $.each($.map(self.orders(), function() {
		// 	return this.security && this.security() && this.security().symbol == 'GRO';
		// }), function() {
		// 	orderShares += parseInt(this.shares());
		// });

		// return parseInt(portfolioShares) + orderShares;
		ko.utils.arrayForEach(self.orders(), function(order) {
			if ( order.security() && order.security().symbol === 'GRO' ) {
				orderShares += Number(order.shares());
			}
		});
		return orderShares;
	});

	self.isMarginEnabled = function() {
		// TODO use a case insensitive
		if ( self.settings && self.settings.margin === 'ON' ) {
			return self.settings.margin;
		}
		return false;
	};

};
