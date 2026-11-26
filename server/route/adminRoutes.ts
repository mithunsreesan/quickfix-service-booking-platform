import express from 'express';
import {protect} from '../middleware/auth.js';
import User from '../model/User.js';
import Service from '../model/Service.js';
import Booking from '../model/Booking.js';
const r=express.Router();
r.use(protect,(req,res,next)=>{if(req.user?.role!=='admin')return res.status(403).json({success:false,message:'Admin access required'});next();});
r.get('/overview',async(_req,res)=>{
 const [users,services,bookings]=await Promise.all([
 User.find().select('name email role image').lean(),
 Service.find().populate('provider','name email').sort({createdAt:-1}).lean(),
 Booking.find().populate('user','name email').populate('provider','name email').populate('service','title').sort({createdAt:-1}).lean()
 ]);
 res.json({success:true,users,services,bookings});
});
export default r;
