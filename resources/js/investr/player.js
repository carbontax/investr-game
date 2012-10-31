function Player(player, game) {
	"use strict";
	/*global Holding: false, Transaction: false, Order: false */
	var self = this;
	
	self.game = game;

	self.user_id = null;
	self.username = null;
	self.balance = ko.observable();
	self.portfolio = ko.observableArray();
	self.transactions = ko.observableArray();
	self.portf_worth = ko.observable();
	self.has_ordered = ko.observable(false);
	self.orders = ko.observableArray();
	self.rank = ko.observable(0);
	
	self.loadPlayer = function(player) {
		self.user_id = player.user_id;
		self.username = player.username;
		self.balance(Number(player.balance));
		self.loadPortfolio(player.portfolio);
		self.loadTransactions(player.transactions);
		self.portf_worth(player.portf_worth);
		if ( player.has_ordered ) {
			self.has_ordered(true);
		}
		if ( player.orders ) {
			// other players in the game will not have visible orders
			self.loadOrders(player.orders);
		}
		self.rank(Number(player.rank));
	};
	
	self.loadPortfolio = function(portfolio) {
		if ( portfolio ) {
			$.each(portfolio, function() {
				self.portfolio.push(new Holding(this, self.game));
			});
		}
	};
	
	self.loadTransactions = function(transactions) {
		if ( transactions ) {
			self.transactions($.map(transactions, function(txn) {
				return new Transaction(txn);
			}));
		}
	};
	
	self.loadOrders = function(orders) {
		self.orders([]);
		$.map(orders, function(order) {
			//log.info("order = " + order);
			var security = ko.utils.arrayFilter(game.securities(), function(s) {
				return s.symbol === order.security_symbol;
			})[0];
			order.security = security;

			self.orders.push(new Order(order));
		});
		if ( self.orders().length > 0 ) {
			self.has_ordered(true);
		}
	};

	// ===== COMPUTED ==== //
	self.balanceFmt = ko.computed(function() {
		return accounting.formatMoney(self.balance());
	});

	self.portfolioNetWorthFmt = ko.computed(function() {
		var portfNetWorth = 0;
		$.each(self.portfolio(), function() {
			portfNetWorth += this.marketValue();
		});
		return accounting.formatMoney(portfNetWorth);
		
	});
	
	self.portfolioIncomeFmt = ko.computed(function() {
		var portfIncome = 0;
		$.each(self.portfolio(), function() {
			portfIncome += this.income();
		});
		return accounting.formatMoney(portfIncome);
	});
	
	self.netWorthFmt = ko.computed(function() {
		return accounting.formatMoney(Number(self.balance()) + Number(self.portf_worth()));
	});
	
	self.hasNoOrders = ko.computed(function(){
		return ! self.has_ordered();
	});
		
	self.firstPlace = ko.computed(function() {
		return self.rank() === 1;
	});
	self.notFirstPlace = ko.computed(function() {
		return self.rank() !== 1;
	});
	
	if ( player ) {
		self.loadPlayer(player);
	}
	
}
