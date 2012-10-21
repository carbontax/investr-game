
function Game(game) {
	"use strict";
	/*globals Player: false, Security: false, Order: false */
	var self = this;
	
	// SETTINGS
	self.settings = null;

	self.initial_balance = ko.observable();
	self.number_of_players = ko.observable();
	self.id = null;
	self.idFmt = function() {
		if ( self.id === null ) {
			return "Unsaved Game";
		}
		return "Game ID: " + self.id;
	};

	self.start_date = null;
	self.startDateFmt = ko.computed(function() {
		// TODO 
		return self.start_date;
	});

	self.securities = ko.observableArray(null);

	self.year = ko.observable();
	self.last_year = ko.observable();
	self.hasNextYear = ko.computed(function() {
		var remaining = Number(self.last_year()) - Number(self.year());
		return remaining > 0;
	});

	self.players = ko.observableArray();
	
	self.loadPlayers = function(players) {
		self.players([]);
		if ( players && typeof(players) === 'object' ) {
			$.each(players, function() {
				self.players.push(new Player(this, self));
			});
		}
	};
	
	self.playerCount = ko.computed(function() {
		return self.players().length;
	});

	self.player = ko.observable();

	self.turn = ko.observable(); // TODO use player().has_ordered
	self.turnFmt = ko.computed(function() {
		if ( self.turn() > 0 ) {
			return "Waiting for other players";
		}
		return "Take your turn";
	});
	
	// an array of new Orders for the current year.
	self.orders = ko.observableArray([new Order()]);
	
	self.disableAllOrdersButtons = ko.observable(false);
	self.disableMoreOrdersButton = ko.observable(false);
	self.disableSendOrdersButton = ko.observable(false);
	self.disableStandButton = ko.computed(function () {
		if ( ! self.disableAllOrdersButtons() && self.orders().length === 0 ) {
			return false;
		}
		return true;
	});
	self.standButtonTitleText = ko.computed(function () {
		if ( self.disableStandButton() ) {
			return "Delete all orders to enable this option.";
		}
		return "Take no action this turn.";
	});
	
	function enableOrderButtons () {
		self.disableAllOrdersButtons(false);
		self.disableMoreOrdersButton(false);
		self.disableSendOrdersButton(false);
	}
	function disableOrderButtons () {
		self.disableAllOrdersButtons(true);
		self.disableMoreOrdersButton(true);
		self.disableSendOrdersButton(true);
	}

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
//			self.showYearMessage();
		}
		// TODO use has_ordered instead
		self.turn(data.turn);
		
		//reset the New Orders form. No, don't. What if somebody is ordering?
//		self.orders([new Order()]);
		enableOrderButtons();
	};

	self.getFirstPlacePlayer = function() {
		return ko.utils.arrayFilter(self.players(), function(p) {
			return p.firstPlace();
		})[0];
	};
	
	self.showYearMessage = function() {
		var msg = 'Beginning year ' + self.year();
		var type = 'info';
		if ( ! self.hasNextYear() ) {
			var winner =  self.getFirstPlacePlayer();
			msg = "GAME OVER! " + winner.username + ' has won';
			type = 'success';
		}
		$.bootstrapGrowl(msg, {
//			top_offset: $('#tabs-pane').position().top + 10,
			align: 'center',
			type: type
		});
	};
	
	self.showOrderForm = ko.computed(function() {
		if ( self.player() && self.player().hasNoOrders() ) {
			return true;
		}
		return false;
	});

	// ============= NEW ORDERS ============= // 

	// tmp method for devel
	self.turnOffOrderButtons = function() {
		disableOrderButtons();
	};
	
	self.newOrder = function() {
		self.orders.push(new Order(this));
	};

	self.removeOrder = function(order) {
		self.orders.remove(order);	
	};
	
	self.sendOrders = function() {
		var result = confirm('End your turn?');
		if ( result ) {
			disableOrderButtons();
			
			var data = ko.toJSON({orders: self.orders}); 
			
			$.ajax("/investr-game/api/games/" + self.id + "/orders", {
				type: 'post',
				dataType: 'json',
				data: data,
				success: function(responseData) {
					// reset the order form
					self.orders([new Order()]);
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
		} else {
			log.debug("Sending orders cancelled by user");
		}
	};
		
	self.sendNullOrder = function() {
		var result = confirm('End your turn without placing orders?'); 
			if ( result ) {
				disableOrderButtons();
								
				$.ajax("/investr-game/api/games/" + self.id + "/no_orders", {
					type: 'post',
					dataType: 'json',
					success: function(responseData) {
						// reset the order form
						self.orders([new Order()]);
						var top_offset = $('#tabs-pane').position().top + 10;
						$.bootstrapGrowl('Your turn is over.', {
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
				
			} else {
				log.debug("STAND order cancelled by user");
			}
	};

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

//	self.ordersIncomeFmt = function() {
//		return accounting.formatMoney(self.ordersIncome());
//	};

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
	};
	
	self.reload = function() {
		log.debug("reload called");
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
	};
	
	self.getPollString = function() {
		var awaitingPlayers = ko.utils.arrayFilter(self.players(), function(player) {
			return player.has_ordered();
		});
		var pollString = self.id + "." + self.year() + "." + awaitingPlayers.length;
		return pollString;
	};
	
	// ============== INIT ============= //
	if ( game ) {
		self.loadGame(game);
	}

}
