const Router = require('express').Router();
const SignUp = require('./controller/sign');
const Password = require('./controller/password');
const Alert = require('./controller/alert');
const Plan = require('./controller/plan');
const Comment = require('./controller/comment');
const CommentPerson = require('./controller/comment_person');
const Rate = require('./controller/rate');
const Impression = require('./controller/impression');
const Funding = require('./controller/funding');
const TreePermit = require('./controller/tree_permit');
const Permit = require('./controller/permit');
const PermitAoi = require('./controller/permit_aoi');
const PermitAoiPerson = require('./controller/permit_aoi_person');
const Subscription = require('./controller/subscription');
const BlockParcel = require('./controller/block_parcel');
const SubscriptionPlansController = require('./controller/subscription_plans');
const SubscriptionCancelController = require('./controller/subscription_cancel');

// const Tag = require('./controller/tag');
// const Status = require('./controller/status');
// const health = require('./Controller/health');
const PlanStatusChange = require('./controller/plan_status_change');
const { wrap, publicWrapper } = require('./controller/controller');

// Sign up
Router.post('/sign/up', wrap(SignUp.signup, SignUp));
Router.post('/sign/activate', wrap(SignUp.activate, SignUp));
Router.post('/sign/in', wrap(SignUp.signin, SignUp));
Router.post('/sign/out', wrap(SignUp.signout, SignUp));

// Person
Router.post('/sign/auth/email', wrap(SignUp.authenticateEmail));

// Plan
Router.get('/plan/', wrap(Plan.browse, Plan));
Router.get('/plan/user', wrap(Subscription.getUserPlans, Plan));
Router.get('/plan/:id', wrap(Plan.read, Plan));

Router.get('/plan_county', wrap(Plan.county, Plan));
Router.get('/plan_status', wrap(Plan.statuses, Plan));

Router.post('/plan/:id/subscribe', wrap(Subscription.subscribe, Subscription));
Router.delete('/plan/:id/subscribe', wrap(Subscription.unsubscribe, Subscription));

Router.get('/plan/:id/status', wrap(PlanStatusChange.byPlan, PlanStatusChange)); 


// Tree
Router.get('/tree/', wrap(TreePermit.browse, TreePermit));
Router.get('/tree/:id', wrap(TreePermit.read, TreePermit));
Router.get('/trees/geojson/', wrap(TreePermit.geojson, TreePermit));


Router.get('/tree_place', wrap(TreePermit.place, TreePermit));

// Permit
Router.get('/permit/', wrap(Permit.browse, Permit))
Router.get('/permit/aoi', wrap(PermitAoi.browse, PermitAoi))
Router.get('/permit/aoi/:id/preview', wrap(PermitAoi.preview, PermitAoi))
Router.get('/permit/aoi/person', wrap(PermitAoiPerson.browse, PermitAoiPerson))
Router.post('/permit/aoi/person', wrap(PermitAoiPerson.create, PermitAoiPerson))
Router.delete('/permit/aoi/person/:id', wrap(PermitAoiPerson.delete, PermitAoiPerson))


// Comment
Router.get('/comment/:plan_id', wrap(Comment.byPlan, Comment));
Router.post('/comment/:plan_id', wrap(Comment.create, Comment));
Router.post('/comment/like/add', wrap(CommentPerson.addLike, Comment));

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
Router.post('/alert/:id/edit', wrap(Alert.update, Alert));
Router.delete('/alert/:id', wrap(Alert.delete, Alert));
Router.delete('/alert/_token/:token', wrap(Alert.unsubscribe, Alert));

// Funding
Router.post('/funding/', wrap(Funding.create, Funding));
Router.get('/funding/stats', wrap(Funding.getFundingStats, Funding));
Router.get('/funding/paymentLink', wrap(Funding.paymentLink, Funding));

// me
Router.get('/me/', wrap(Alert.browse, Alert));

// Public API
Router.get('/public/plan', publicWrapper(Plan.publicBrowse, Plan));
// Router.get('/cron/send_planning_alerts', wrap(sendPlanningAlerts));

// Tag
// Router.get('/tag/', wrap(Tag.instance.browse, Tag.instance));

// Status
// Router.get('/', wrap(Status.browse));

// Block Parcel

Router.get('/topfive', wrap(BlockParcel.topfive, BlockParcel));
Router.get('/centroid', wrap(BlockParcel.centroid, BlockParcel));

// Health
Router.get('/health', wrap(() => true));

// Subscription Plans
Router.get('/subscription_plans', publicWrapper(SubscriptionPlansController.browse, SubscriptionPlansController));
Router.get('/subscription_plans/:plan_id/get_payment_link', wrap(SubscriptionPlansController.getPaymentLink, SubscriptionPlansController));
Router.post('/subscription_plans', wrap(SubscriptionPlansController.create, SubscriptionPlansController));

// Subscription Cancel
Router.post('/subscription_cancel', wrap(SubscriptionCancelController.cancel, SubscriptionCancelController));
Router.get('/subscription_cancel', wrap(SubscriptionCancelController.browse, SubscriptionCancelController));

module.exports = Router;
