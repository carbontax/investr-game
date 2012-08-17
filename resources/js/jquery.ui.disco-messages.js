/*
 * Standard error and message reporting. This relies on jquery.ui only
 * because we use the same css classes to style our error and info messages.
 * 
 * ben.smithlea@utoronto.ca
 */
(function($) {
	$.fn.disco_messages = function(action) {
		// save the function arguments for later
		var args = arguments;

		var options = $.extend({}, $.fn.disco_messages.defaults, action);
		
		if ( typeof action == 'object' ) {
			action = options.type;
			msg = options.msg;
		} else if ( action && typeof action == 'string' ) {
			if ( action === 'info' || action === 'errors' ) {
				options.type = action;
				options.msg = Array.prototype.slice.call(args, 1)[0];
			} else {
				// use the default message type
				options.msg = action;
			}
		}
		
		return this.each(function() {
			$.disco_clear_messages();
			if ( options.insert_action === 'append' ) {
				showMessage().appendTo(this);
			} else {
				showMessage().prependTo(this);
			}
		
			function showMessage() {
				if ( ! options.msg ) { return $('<span/>'); }
				var type = options.type;
				var widget = $('<div/>').addClass('ui-widget')
				.attr('id', $.fn.disco_messages.widget_id[type]);
	
				var state = $('<div/>').addClass(options[type].state_class)
				.addClass('ui-corner-all').addClass(options[type].style);
				
				var icon = $('<span/>').addClass('ui-icon')
				.addClass(options[type].icon_class).addClass(options[type].style);
	
				return $(widget)
				.append($(state)
						.append(icon, $('<strong/>', {html : options[type].label + ': '}), options.msg));
			}
		});
	};

	$.disco_clear_messages = function() {
		$('#' + $.fn.disco_messages.widget_id.info).remove();
		$('#' + $.fn.disco_messages.widget_id.errors).remove();
	};
	
	/*
	 * These css id values are reserved for use in the disco_messages plugin. 
	 */
	$.fn.disco_messages.widget_id = {
		info: 'disco-info',
		errors: 'disco-errors' 
	};
	
	$.fn.disco_messages.defaults = {
		type : 'info',
		msg: '',
		insert_action : 'prepend',
		info : {
			label : 'Info',
			style : 'disco-info-style',
			state_class : 'ui-state-highlight',
			icon_class : 'ui-icon-info',
			element$ : $('#disco-info')
		},
		errors : {
			label : 'Error',
			style : 'disco-error-style',
			state_class : 'ui-state-error',
			icon_class : 'ui-icon-alert',
			element$ : $('#disco-errors')
		}
	}
})(jQuery);