
function Game(game) {
	var self = this;
	
	// SETTINGS
	self.settings;

	self.initial_balance = ko.observable();
	self.number_of_players = ko.observable();
	self.id = null;
	self.idFmt = function() {
		if ( self.id === null ) {
			return "Unsaved Game";
		}
		return "Game ID: " + self.id;
	}

	self.start_date;
	self.startDateFmt = ko.computed(function() {
		// TODO 
		return self.start_date;
	});

	self.securities = ko.observableArray(null);

	self.year = ko.observable();
	self.last_year;
	self.hasNextYear = ko.computed(function() {
		var remaining = parseInt(self.last_year) - parseInt(self.year());
		return remaining > 1;
	});
	self.yearFmt = ko.computed(function() {
/*		if ( self.hasNextYear() ) {
			return "Year " + self.year();
		} else {
			return "Game Over";
		} */
	});

	self.players = ko.observableArray();
	
	self.loadPlayers = function(players) {
		self.players([]);
		if ( players && typeof(players) === 'object' ) {
			$.each(players, function() {
				self.players.push(new Player(this));
			});
		}
	}
	
	self.playerCount = ko.computed(function() {
		return self.players().length;
	});

	self.player = ko.observable();

	self.turn; // TODO use player().has_ordered
	self.turnFmt = ko.computed(function() {
		if ( self.turn && parseInt(self.turn) > 0 ) {
			return "Waiting for other players";
		}
		return "Take your turn";
	});
	
	// an array of new Orders for the current year.
	self.orders = ko.observableArray();
	
	self.disableOrderButtons = ko.observable(false);

	self.loadGame = function(data) {
		self.id = data.id;
		self.settings = data.settings;
		self.initial_balance(data.initial_balance);
		self.number_of_players(data.number_of_players);
		self.start_date = data.start_date;
		if ( data.securities && data.securities.length > 0 ) {
			self.securities($.map(data.securities, function(s) {
				return new Security(s);
			}));
		}
		self.year(data.year);
		self.last_year = data.last_year;
		self.loadPlayers(data.players);
		if ( data.player && data.player.user_id ) {
			self.player(new Player(data.player, self));
		}
		// TODO use has_ordered instead
		self.turn = data.turn;
		//reset the New Orders form.
		self.orders([new Order()]);
		self.disableOrderButtons(false);
	}
	if ( game ) {
		self.loadGame(game);
	}
	self.showOrderForm = ko.computed(function() {
		if ( self.player() && self.player().hasNoOrders() ) {
			return true;
		}
		return false;
	});

	// ORDERS 
	
	self.newOrder = function() {
		self.orders.push(new Order(this));
	};

	self.removeOrder = function(order) {
		self.orders.remove(order);	
	}
	
	self.sendOrders = function() {
		if (! $('#order-form').valid() ) {
			return false;
		}
		self.postJSONOrders();
	}
	
	self.postJSONOrders = function() {
		if (! confirm('End your turn?') ) {
			return false;
		}
		self.disableOrderButtons(true);
		
		var data = ko.toJSON({orders: self.orders}); 
//		var data = data || ko.toJSON({orders: self.orders}); 
		$.ajax("/investr-game/api/games/" + self.id + "/orders", {
			type: 'post',
			dataType: 'json',
			data: data,
			success: function(responseData) {
//				console.log('success');
				if ( responseData['new_year'] ) {
					self.reload();
				} else {
					self.player().loadOrders(responseData);
				}
			},
			error: function(xhr) {
				$('#messages').addClass("label label-error").append(xhr.responseText);
			}
		});	
	}
		
	self.sendNullOrder = function() {
//		if ( !confirm("End your turn?") ) {
//			return false;
//		}
		var order = new Order({action: 'NULL'});
		self.orders([order]);
		self.postJSONOrders();
//		$.ajax("/investr-game/api/games/" + self.id + "/orders", {
//			type: 'post',
//			contentType: 'application/json',
//			dataType: 'json',
//			data: ko.toJSON(data),
//			success: function(data) {
//				ko.utils.arrayForEach(data, function(order) {
//					self.player().orders.push(new Order(order));
//				});
//			},
//			error: function(xhr) {
//				$('#messages').append(xhr.responseText);
//			}
//		});
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
		window.console && console.log("ordersIncome not implemented");
		return 0;
	});

	self.ordersIncomeFmt = function() {
		return accounting.formatMoney(self.ordersIncome());
	};

	self.ordersNetFmt = ko.computed(function() {
		return accounting.formatMoney(self.ordersAccountCash() + self.ordersIncome());
	});
// END ORDERS

	// UNUSED
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

	self.joinButtonText = ko.computed(function() {
		return self.player() ? 'Waiting for more players' : 'Join';
	});

	self.isMarginEnabled = function() {
		// TODO use a case insensitive
		if ( self.settings && self.settings.margin === 'ON' ) {
			return self.settings.margin;
		}
		return false;
	};
	
	self.checkNewYear = function() {
		var newYear = false;
		$.ajax({
			url: '/investr-game/api/games/' + self.id + '/year',
			type: 'get',
			dataType: 'json',
			success: function(data) {
				if ( parseInt(data['year']) > parseInt(self.year()) ) {
					self.reload();
					$('#game-status-container').effect('highlight', {}, 1500);
				}
			},
			error: self.ajaxFailureCallback
		});
		
//		if ( newYear ) {
//			self.reload();
//		}
	};
	
	self.reload = function() {
		window.console && console.log("reload called");
		$.ajax({
			url: '/investr-game/api/games/' + self.id,
			dataType: 'json',
			type: 'get',
			success: function(data) {
				self.loadGame(data);
			},
			error: self.ajaxFailureCallback
		});
	}
};
