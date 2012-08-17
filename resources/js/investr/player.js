function Player(player) {
	var self = this;

	self.username = player.username;
	self.portfolio = player.portfolio;
	self.balance = player.balance;
	self.margin = player.margin;

	self.netWorth = ko.computed(function() {
		// TODO
		return 5000;
	});

}
