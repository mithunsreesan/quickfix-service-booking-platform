import {Request,Response} from 'express';
import Booking from '../model/Booking.js';
import {HttpError,id} from '../utils/validation.js';
export async function customerPayment(req:Request,res:Response){
 const method=req.body.method;
 if(!['cash','demo_gpay'].includes(method))throw new HttpError(400,'Choose cash or demo Google Pay');
 if(method==='demo_gpay'&&process.env.DEMO_PAYMENTS!=='true')throw new HttpError(403,'Demo payments are disabled');
 const booking=await Booking.findOneAndUpdate({_id:id(req.body.bookingId),user:req.user!._id,status:'completed',$or:[{paymentStatus:'unpaid'},{paymentStatus:{$exists:false}}]},{$set:{paymentMethod:method,paymentStatus:method==='cash'?'cash_pending':'demo_paid',paidAt:method==='cash'?null:new Date()}},{new:true,runValidators:true});
 if(!booking)throw new HttpError(409,'Only your completed, unpaid bookings can be paid. Refresh the page.');
 res.json({success:true,booking});
}
export async function confirmCash(req:Request,res:Response){
 const booking=await Booking.findOneAndUpdate({_id:id(req.body.bookingId),provider:req.user!._id,status:'completed',paymentMethod:'cash',paymentStatus:'cash_pending'},{$set:{paymentStatus:'paid',paidAt:new Date()}},{new:true,runValidators:true});
 if(!booking)throw new HttpError(409,'No pending cash payment for this booking');
 res.json({success:true,booking});
}
