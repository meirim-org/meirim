const Router = require('express').Router();
const SignUp = require('./controller/sign');
const Password = require('./controller/password');
const Alert = require('./controller/alert');
const Plan = require('./controller/plan');
const Comment = require('./controller/comment');
const Rate = require('./controller/rate');
const Impression = require('./controller/impression');

const Subscription = require('./controller/subscription');
// const Tag = require('./controller/tag');
// const Status = require('./controller/status');
// const health = require('./Controller/health');
const { wrap, publicWrapper } = require('./controller/controller');
const TreePermit = require('./controller/tree_permit');

// Sign up
Router.post('/sign/up', wrap(SignUp.signup, SignUp));
Router.post('/sign/activate', wrap(SignUp.activate, SignUp));
Router.post('/sign/in', wrap(SignUp.signin, SignUp));
Router.post('/sign/out', wrap(SignUp.signout, SignUp));

// Person
Router.post('/sign/auth/email', wrap(SignUp.authenticateEmail));

// Plan
Router.get('/plan/', wrap(Plan.browse, Plan));
Router.get('/plan/:id', wrap(Plan.read, Plan));

Router.get('/plan_county', wrap(Plan.county, Plan));
Router.get('/plan_status', wrap(Plan.statuses, Plan));

Router.post('/plan/:id/subscribe', wrap(Subscription.subscribe, Subscription));
Router.delete('/plan/:id/subscribe', wrap(Subscription.unsubscribe, Subscription)
);

// Tree
Router.get('/tree/', wrap(TreePermit.browse, TreePermit));
Router.get('/tree/:id', wrap(TreePermit.read, TreePermit));

Router.get('/tree_place', wrap(TreePermit.place, TreePermit));


// Comment
Router.get('/comment/:plan_id', wrap(Comment.byPlan, Comment));
Router.post('/comment/:plan_id', wrap(Comment.create, Comment));

// Rate
Router.get('/rate/:plan_id', wrap(Rate.byPlan, Rate));
Router.post('/rate/', wrap(Rate.create, Rate));

// impression
Router.post('/impression/:plan_id', wrap(Impression.create, Impression));

// Password
Router.post('/password/sendResetToken', wrap(Password.sendResetToken));
Router.post('/password/resetWithToken', wrap(Password.resetWithToken));

// Alert
Router.get('/alert/', wrap(Alert.browse, Alert));
Router.get('/alert/:id', wrap(Alert.read, Alert));
Router.post('/alert/', wrap(Alert.create, Alert));
Router.delete('/alert/:id', wrap(Alert.delete, Alert));
Router.delete('/alert/_token/:token', wrap(Alert.unsubscribe, Alert));

// me
Router.get('/me/', wrap(Alert.browse, Alert));

// Public API
Router.get('/public/plan', publicWrapper(Plan.publicBrowse, Plan));
// Router.get('/cron/send_planning_alerts', wrap(sendPlanningAlerts));

// Tag
// Router.get('/tag/', wrap(Tag.instance.browse, Tag.instance));

// Status
// Router.get('/', wrap(Status.browse));

// Health
Router.get('/health', wrap(() => true));

module.exports = Router;
