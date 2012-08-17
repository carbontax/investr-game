var log = log4javascript.getLogger();

var popUpAppender = new log4javascript.PopUpAppender();
log.addAppender(popUpAppender);

/*var ajaxAppender = new log4javascript.AjaxAppender("/index.html");
log.addAppender(ajaxAppender);*/