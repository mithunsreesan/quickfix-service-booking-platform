import express from 'express';
import {protect,providerOnly} from '../middleware/auth.js';
import {addFeedback,changeBookingStatus,checkAvailabilityOfService,createBooling,getProviderBooking,getUserBooking,availableSlots} from '../controller/bookingController.js';
import {customerPayment,confirmCash} from '../controller/paymentController.js';
const r=express.Router();
r.get('/payment-config',protect,(_req,res)=>res.json({demoPayments:process.env.DEMO_PAYMENTS==='true'}));
r.post('/payment',protect,customerPayment);r.post('/confirm-cash',protect,providerOnly,confirmCash);
r.post('/check-availability',checkAvailabilityOfService);r.get('/slots/:id',availableSlots);
r.post('/create',protect,createBooling);r.get('/user',protect,getUserBooking);r.get('/provider',protect,providerOnly,getProviderBooking);r.post('/change-status',protect,changeBookingStatus);r.post('/feedback',protect,addFeedback);export default r;
