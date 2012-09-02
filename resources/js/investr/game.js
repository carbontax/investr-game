
//function Game(securities, lastYear, players, year) {
function Game(game) {
	var self = this;

	self.id = game.id;
	self.idFmt = function() {
		return "Game ID: " + self.id;
	}

	self.startDate = game.startDate;
	self.startDateFmt = ko.computed(function() {
		// TODO 
		return self.startDate;
	});

	self.options = game.options;

	self.securities = ko.observableArray($.map(game.securities, function(s) {
		return new Security(s);
	}));

	self.year = ko.observable(game.year);
	self.lastYear = game.lastYear;
	self.hasNextYear = ko.computed(function() {
		return self.year() < self.lastYear;
	});
	self.yearFmt = ko.computed(function() {
		if ( self.hasNextYear() ) {
			return "Year " + self.year();
		} else {
			return "Game Over";
		}
	});

	var otherPlayers = $.map(game.otherPlayers, function(player) {
		return new Player(player, self);
	});
	self.otherPlayers = ko.observableArray(otherPlayers);

	self.player = ko.observable(new Player(game.player, self));

	self.playerCount = ko.computed(function() {
		return self.otherPlayers().length + 1;
	});

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
		var cash = self.player().balance;
		$.map(self.orders(), function(order) {
			if ( order.amount() ) {
				cash += order.amount();
			}
		});
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
		var p = self.player().portfolio.slice(0); // copy portfolio
		$.each(self.orders(), function(i, order) {
			var success = false;
			if (order && order.symbol) {
				p = $.map(p, function(h) {
					if ( h.symbol === order.symbol) {
						h.shares += order.shares;
						success = true;
					}
					return h;
				});
				if ( ! success ) {
					p.push(new Holding(order, self));
				}
			}
		});
		return p;
	});

// demo function only
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

	self.isMarginEnabled = function() {
		if ( self.options && self.options.margin ) {
			return self.options.margin;
		}
		return false;
	};

};
