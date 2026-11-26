import {Request,Response} from 'express';
import Booking from '../model/Booking.js';
import Service from '../model/Service.js';
import {HttpError,id,slotDate,text} from '../utils/validation.js';
export const checkAvailability = async (provider: any,date:Date,time:string) => !(await Booking.exists({provider,date,time,active:true}));
export const checkAvailabilityOfService=async(req:Request,res:Response)=>{
 const {date,time}=slotDate(req.body.date,req.body.time);
 const area=text(req.body.service_area,'Area',120);
 const services=await Service.find({service_area:{$regex:`^${area.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}$`,$options:'i'},availability:true,archived:{$ne:true}});
 const availableServices=[];
 for(const s of services) if(await checkAvailability(s.provider,date,time))availableServices.push(s);
 res.json({success:true,availableServices});
};
export const availableSlots=async(req:Request,res:Response)=>{
 const service=await Service.findOne({_id:id(req.params.id),archived:{$ne:true}});
 if(!service)throw new HttpError(404,'Service not found');
 const day=req.query.date;
 const result=[];
 for(const time of ['9-11','11-1','2-4','4-6']){
  let available=false;
  try{const {date}=slotDate(day,time);available=service.availability&&await checkAvailability(service.provider,date,time);}catch(e){if(!(e instanceof HttpError))throw e;}
  result.push({time,available});
 }
 res.json({success:true,slots:result});
};
export const createBooling=async(req:Request,res:Response)=>{
 const {date,time}=slotDate(req.body.date,req.body.time);
 const service=await Service.findOne({_id:id(req.body.service),availability:true,archived:{$ne:true}});
 if(!service)throw new HttpError(404,'Service is not available');
 if(String(service.provider)===String(req.user!._id))throw new HttpError(400,'You cannot book your own service');
 const address=text(req.body.address,'Service address',500),phone=text(req.body.phone,'Phone',20);
 if(!/^\+?[\d\s-]{10,20}$/.test(phone))throw new HttpError(400,'Enter a valid contact number');
 const notes=typeof req.body.notes==='string'?req.body.notes.trim():'';
 if(notes.length>1000)throw new HttpError(400,'Notes are too long');
 const booking=await Booking.create({service:service._id,provider:service.provider,user:req.user!._id,date,time,price:Math.round(service.price*200)/100,address,phone,notes,serviceSnapshot:{title:service.title,image:service.image,category:service.category,service_area:service.service_area,staffCount:service.staffCount}});
 res.status(201).json({success:true,booking,message:'Booking requested. Pay the provider after service.'});
};
export const getUserBooking=async(req:Request,res:Response)=>{const bookings=await Booking.find({user:req.user!._id}).populate('service').populate('provider','name email image').sort({createdAt:-1});res.json({success:true,bookings});};
export const getProviderBooking=async(req:Request,res:Response)=>{const bookings=await Booking.find({provider:req.user!._id}).populate('service').populate('user','name email image').sort({createdAt:-1});res.json({success:true,bookings});};
export const changeBookingStatus=async(req:Request,res:Response)=>{
 const booking=await Booking.findById(id(req.body.bookingId));
 if(!booking)throw new HttpError(404,'Booking not found');
 const provider=String(booking.provider)===String(req.user!._id)&&req.user!.role==='provider';
 const customer=String(booking.user)===String(req.user!._id);
 if(!provider&&!customer)throw new HttpError(403,'This booking does not belong to you');
 const next=req.body.status;
 const transitions:Record<string,string[]>={pending:['confirmed','cancelled'],confirmed:['completed','cancelled'],completed:[],cancelled:[]};
 if(!transitions[booking.status].includes(next)||(!provider&&next!=='cancelled'))throw new HttpError(400,'This status change is not allowed');
 const {starts}=slotDate(booking.date.toISOString().slice(0,10),booking.time,false);
 if(customer&&!provider&&starts.getTime()<=Date.now())throw new HttpError(400,'Contact the provider to cancel a service that has already started');
 if(next==='completed'&&starts.getTime()+7200000>Date.now())throw new HttpError(400,'A service can only be completed after its scheduled end');
 const updated=await Booking.findOneAndUpdate({_id:booking._id,status:booking.status},{$set:{status:next,active:next!=='cancelled'}},{new:true,runValidators:true});
 if(!updated)throw new HttpError(409,'Booking changed. Please refresh.');
 res.json({success:true,booking:updated,message:'Booking updated'});
};
export const addFeedback=async(req:Request,res:Response)=>{
 const rating=req.body.rating;
 if(!Number.isInteger(rating)||rating<1||rating>5)throw new HttpError(400,'Choose a whole-number rating from 1 to 5');
 const feedback=text(req.body.feedback,'Feedback',2000);
 const booking=await Booking.findOneAndUpdate({_id:id(req.body.bookingId),user:req.user!._id,status:'completed',rating:0},{$set:{rating,feedback}},{new:true,runValidators:true});
 if(!booking)throw new HttpError(409,'Only your completed, unreviewed bookings can be reviewed');
 res.json({success:true,booking,message:'Thank you for your review'});
};
