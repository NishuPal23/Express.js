
import { Router } from 'express';
import {
  getRazorpayApiKey,
  buySubscription,
  verifySubscription,
  cancelSubscription,
  allPayments,
} from '../controllers/payment.controller.js';
import isLoggedIn from "../middlewares/auth.middleware.js";
import {authorizeRoles,authorizeSubscribers} from "../middlewares/middleware.authAdmin.js";

const router = Router();

router.route('/subscribe').post(isLoggedIn, buySubscription);
router.route('/verify').post(isLoggedIn, verifySubscription);
router
  .route('/unsubscribe')
  .post(isLoggedIn, authorizeSubscribers, cancelSubscription);
router.route('/razorpay-key').get(isLoggedIn, getRazorpayApiKey);
router.route('/').get(isLoggedIn, authorizeRoles('ADMIN'), allPayments);

export default router;