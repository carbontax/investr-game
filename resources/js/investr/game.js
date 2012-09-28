
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
	self.last_year = ko.observable();
	self.hasNextYear = ko.computed(function() {
		var remaining = parseInt(self.last_year()) - parseInt(self.year());
		return remaining > 0;
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
				self.players.push(new Player(this, self));
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
	self.disableStandButton = ko.computed(function() {
		if ( self.orders().length == 0 ) {
			return false;
		}
		return true;
	});

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
		self.last_year(data.last_year);
		self.loadPlayers(data.players);
		if ( data.player && data.player.user_id ) {
			self.player(new Player(data.player, self));
			self.showYearMessage();
		}
		// TODO use has_ordered instead
		// HACK to check if game is open
		self.turn = data.turn;
		
		//reset the New Orders form.
		self.orders([new Order()]);
		self.disableOrderButtons(false);
	}

	self.showYearMessage = function() {
		var msg = 'Beginning year ' + self.year();
		var type = 'info';
		if ( ! self.hasNextYear() ) {
			msg = "GAME OVER! " + self.getWinner() + ' has won';
			type = 'success';
		}
		$.bootstrapGrowl(msg, {
//			top_offset: $('#tabs-pane').position().top + 10,
			align: 'center',
			type: type
		});
	};
	
	self.getWinner = function() {
		return "I don't know yet who";
	};
	
	self.showOrderForm = ko.computed(function() {
		if ( self.player() && self.player().hasNoOrders() ) {
			return true;
		}
		return false;
	});

	// ============= NEW ORDERS ============= // 
	self.newOrder = function() {
		self.orders.push(new Order(this));
	};

	self.removeOrder = function(order) {
		self.orders.remove(order);	
	}
	
	self.sendOrders = function() {
//		if (! $('#order-form').valid() ) {
//			return false;
//		}
		self.postJSONOrders();
	}
	
	self.postJSONOrders = function() {
		if (! confirm('End your turn?') ) {
			return false;
		}
		self.disableOrderButtons(true);
		
		var data = ko.toJSON({orders: self.orders}); 
		
		$.ajax("/investr-game/api/games/" + self.id + "/orders", {
			type: 'post',
			dataType: 'json',
			data: data,
			success: function(responseData) {
				var top_offset = $('#tabs-pane').position().top + 10;
				$.bootstrapGrowl('Orders saved.', {
					top_offset: top_offset,
					align: 'center'
				});
				if ( responseData['new_year'] ) {
					self.reload();
				} else {
					$.bootstrapGrowl('Waiting for other players', {
						top_offset: top_offset,
						align: 'center'
					});
					self.player().loadOrders(responseData);
				}
			},
			error: function(xhr) {
				$('#messages').addClass("label label-error").append(xhr.responseText);
			}
		});	
	}
		
	self.sendNullOrder = function() {
		var order = new Order({action: 'NULL'});
		self.orders([order]);
		self.postJSONOrders();
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
	
	self.ordersCashOk = ko.computed(function() {
		return self.ordersAccountCash() >= 0;
	});

	self.ordersCashBust = ko.computed(function() {
		return ! self.ordersCashOk();
	});

//	self.ordersIncome = ko.computed(function() {
//		window.console && console.log("ordersIncome not implemented");
//		return 0;
//	});

	self.ordersIncomeFmt = function() {
		return accounting.formatMoney(self.ordersIncome());
	};

//	self.ordersNetFmt = ko.computed(function() {
//		return accounting.formatMoney(self.ordersAccountCash() + self.ordersIncome());
//	});
// =============== END NEW ORDERS ============== //

	self.joinButtonText = ko.computed(function() {
		return self.player() ? 'Waiting for more players' : 'Join';
	});

	self.isMarginEnabled = function() {
		// TODO use a case insensitive string?
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
					var top_offset = $('#tabs-pane').position().top + 10;
					$.bootstrapGrowl('Beginning year ' + data['year'], {
						top_offset: top_offset,
						align: 'center'
					});
					self.reload();
				}
			},
			error: self.ajaxFailureCallback
		});
	};
	
	self.reload = function() {
		window.console && console.log("reload called");
		$.ajax({
			url: '/investr-game/api/games/' + self.id,
			dataType: 'json',
			type: 'get',
			success: function(data) {
				var top_offset = $('#tabs-pane').position().top + 10;
				self.loadGame(data);
			},
			error: self.ajaxFailureCallback
		});
	}
	
	// ============== INIT ============= //
	if ( game ) {
		self.loadGame(game);
	}
};
