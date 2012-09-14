
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

	self.securities = ko.observableArray(null);
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

	self.players = ko.observableArray();
	
	self.loadPlayers = function(players) {
		self.players(null);
		if ( players && typeof(players) === 'array' ) {
			$.each(players, function() {
				self.players.push(new Player(this));
			});
		}
	}
	
	self.loadPlayers(game.players);
	
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
		if ( self.turn && parseInt(self.turn) > 0 ) {
			return "Done";
		}
		return "Waiting";
	});

	// ORDERS 
	self.orders = ko.observableArray([new Order()]);
	self.showOrderForm = ko.computed(function() {
		if ( self.player() && self.player().hasNoOrders() ) {
			return true;
		}
		return false;
	});

	self.newOrder = function() {
		self.orders.push(new Order(this));
	};

	self.removeOrder = function(order) {
		self.orders.remove(order);	
	}

	self.sendOrders = function() {
		var data = ko.toJSON({orders: self.orders}); 

		$.ajax("/investr-game/api/games/" + self.id + "/orders", {
			type: 'post',
			contentType: 'application/json',
			data: data,
			success: function(data) {
				ko.utils.arrayForEach(data, function(order) {
					self.player().orders.push(new Order(order));
				});
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
		var ppList = [];
		if ( self.player() ) {
			ppList = $.map(self.player().portfolio, function(h) {
				return new Holding({symbol: h.symbol, shares: h.shares}, self);
			});
			ko.utils.arrayForEach(self.orders(), function(order) {
				if (order && order.security() && order.security().symbol) {
					ppList = $.map(ppList, function(pp) {
						if ( pp.symbol === order.security().symbol) {
							pp.shares += order.sharesDelta();
						}
						return pp;
					});
				}
			});
		}
		return ppList;
	});

	self.openButtonText = ko.computed(function() {
		 return self.year() > 0 ? 'Open' : 'Waiting for more players';
	});

	self.openButtonEnable = ko.computed(function() {
		 return self.year() > 0 ? true : false;
	});

	self.isMarginEnabled = function() {
		// TODO use a case insensitive
		if ( self.settings && self.settings.margin === 'ON' ) {
			return self.settings.margin;
		}
		return false;
	};

};
