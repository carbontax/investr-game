/*jslint todo: true, white: true */
/*global User: false, Game: false */
function InvestrAdminViewModel() {
	"use strict";
	var self = this;

	self.title = "Investr Admin";

	self.user = ko.observable(new User());
	self.username = ko.computed(function () {
		if (self.user() && self.user().username) {
			return self.user().username;
		}
		return "";
	});
	
	self.showLoginForm = ko.observable(false);
	
	self.showResetPasswordForm = ko.observable(false);
	
	self.enableLoginButton = ko.observable(true);

  self.userData = ko.observableArray();

  self.loadUserData = function() {
    self.activeGameData([]);
    self.completedGameData([]);
		$.ajax({
			url: '/investr-game/api/admin/users',
			type: 'get',
			dataType: 'json',
			success: function (data) {
				self.userData(data);
			},
			error: self.ajaxFailureCallback
		});
  }

  self.showUsers = function() {
    self.loadUserData();
    window.history.pushState(self.userData(), "Users", "#users");
  }

  self.activeGameData = ko.observableArray();

  self.loadActiveGameData = function() {
    self.userData([]);
    self.completedGameData([]);
		$.ajax({
			url: '/investr-game/api/admin/games/active',
			type: 'get',
			dataType: 'json',
			success: function (data) {
				self.activeGameData(data);
			},
			error: self.ajaxFailureCallback
		});
  }

  self.showActiveGames = function() {
    self.loadActiveGameData();
    window.history.pushState(self.activeGameData(), "Active Games", "#games/active");
  }

  self.completedGameData = ko.observableArray();

  self.loadCompletedGameData = function() {
    self.userData([]);
    self.activeGameData([]);
		$.ajax({
			url: '/investr-game/api/admin/games/completed',
			type: 'get',
			dataType: 'json',
			success: function (data) {
				self.completedGameData(data);
			},
			error: self.ajaxFailureCallback
		});
  }

  self.showCompletedGames = function() {
    self.loadCompletedGameData();
    window.history.pushState(self.completedGameData(), "Completed Games", "#games/completed");
  }

	self.ajaxFailureCallback = function (xhr) {
		if (xhr.status === 401) {
			self.user(new User());
		}
		$('#messages').addClass("alert alert-error").append(xhr.responseText);
	};
}
