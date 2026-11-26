import {Request,Response} from 'express';
import User from '../model/User.js';
import Service from '../model/Service.js';
import Booking from '../model/Booking.js';
import {saveImage} from '../config/imageKit.js';
import {HttpError,id,serviceInput} from '../utils/validation.js';
export const changeRollToProvider=async(req:Request,res:Response)=>{if(req.user!.role==='admin')throw new HttpError(403,'Admin accounts cannot become providers');await User.findByIdAndUpdate(req.user!._id,{role:'provider'});res.json({success:true,message:'Your provider account is ready'});};
async function ownService(req:Request){const s=await Service.findOne({_id:id(req.body.serviceId),provider:req.user!._id,archived:{$ne:true}});if(!s)throw new HttpError(404,'Service not found or not owned by you');return s;}
export const addService=async(req:Request,res:Response)=>{
 const data=serviceInput(req.body);
 if(!req.file)throw new HttpError(400,'Please upload a service image');
 const image=await saveImage(req.file);
 const service=await Service.create({...data,image,provider:req.user!._id});res.status(201).json({success:true,service,message:'Service listed'});
};
export const updateService=async(req:Request,res:Response)=>{
 const s=await ownService(req),data=serviceInput(req.body);
 Object.assign(s,data);if(req.file)s.image=await saveImage(req.file);await s.save();res.json({success:true,service:s,message:'Service updated'});
};
export const getProviderService=async(req:Request,res:Response)=>{res.json({success:true,service:await Service.find({provider:req.user!._id,archived:{$ne:true}}).sort({createdAt:-1})});};
export const toggleServiceAvailability=async(req:Request,res:Response)=>{const s=await ownService(req);s.availability=!s.availability;await s.save();res.json({success:true,service:s,message:'Availability updated'});};
export const deleteService=async(req:Request,res:Response)=>{
 const s=await ownService(req);
 if(await Booking.exists({service:s._id,status:{$in:['pending','confirmed']}}))throw new HttpError(409,'Complete or cancel active bookings before archiving this service');
 s.archived=true;s.availability=false;await s.save();res.json({success:true,message:'Service archived; booking history retained'});
};
export const getDashboardData=async(req:Request,res:Response)=>{
 const bookings=await Booking.find({provider:req.user!._id}).populate('service').sort({createdAt:-1});
 const month=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit'}).format(new Date());
 const completed=bookings.filter(b=>b.status==='completed');
 res.json({success:true,dashboardData:{totalServices:await Service.countDocuments({provider:req.user!._id,archived:{$ne:true}}),totalBookings:bookings.length,pendingBookings:bookings.filter(b=>b.status==='pending').length,completedBookings:completed.length,recentBookings:bookings.slice(0,4),monthlyRevenue:completed.filter(b=>b.paymentStatus==='paid'&&new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit'}).format(b.date)===month).reduce((s,b)=>s+b.price,0)}});
};
export const updateUserImage=async(req:Request,res:Response)=>{if(!req.file)throw new HttpError(400,'Image required');const image=await saveImage(req.file);await User.findByIdAndUpdate(req.user!._id,{image});res.json({success:true,image,message:'Profile image updated'});};
