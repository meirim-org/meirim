const ArchiveNotificationController = require('./archive_notification');
const NotificationController = require('./notification');
const CommentController = require('./comment');
const PlanController = require('./plan');
const SubscribtionController = require('./subscription');
const CommentPersonController = require('./comment_person');
const AlertController = require('./alert');

module.exports = {
	SubscribtionController,	
	CommentPersonController,
	CommentController,
	AlertController,
	ArchiveNotificationController,
	NotificationController,
	PlanController
};