
//function Game(securities, lastYear, players, year) {
function Game(game, url) {
	var self = this;

	self.url = url;

/*	self.adjustPrices = function(roll, market) {
		for ( var index in self.securities() ) {
			self.securities()[index].adjustPrice(roll, market);
		}
	}
*/
	self.options = game.options;

	self.securities = ko.observableArray($.map(game.securities, function(s) {
		return new Security(s);
	}));

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

	var otherPlayers = $.map(game.otherPlayers, function(player) {
		return new Player(player, self);
	});
	self.otherPlayers = ko.observableArray(otherPlayers);

	self.player = ko.observable(new Player(game.player, self));

	// ORDERS 
	self.orders = ko.observableArray([new Order(this)]);

	self.newOrder = function() {
		self.orders.push(new Order(this));
	};

	self.sendOrders = function() {
		var data = ko.toJSON({orders: self.orders}); 
/*		var data = {orders: "bar"};
*/		$.ajax(self.url + "/orders", {
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
	
/*		$.ajax(self.url + "/orders", {
			type: 'post',
//			contentType: 'application/json',
			data: {"foo": "bar"},
			success: function(responseText) {
				$('messages').append(responseText);
			},
			error: function(xhr) {
				$('#messages').append(xhr.responseText);
			}
		}); */
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
