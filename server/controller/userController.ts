import {Request,Response} from 'express';
import bcrypt from 'bcrypt';
import User from '../model/User.js';
import Service from '../model/Service.js';
import Booking from '../model/Booking.js';
import generateToken from '../utils/generateToken.js';
import {email,text,id,HttpError} from '../utils/validation.js';
import {withRatings} from '../utils/ratings.js';
const publicUser=(u:any)=>({_id:u._id,name:u.name,email:u.email,role:u.role,image:u.image});
export const registerUser=async(req:Request,res:Response)=>{
 const name=text(req.body.name,'Name',80),address=email(req.body.email),password=req.body.password;
 if(typeof password!=='string'||password.length<8||Buffer.byteLength(password)>72)throw new HttpError(400,'Password must be 8–72 bytes');
 if(await User.exists({email:address}))throw new HttpError(409,'An account with this email already exists');
 const user=await User.create({name,email:address,password:await bcrypt.hash(password,12)});
 res.status(201).json({success:true,token:generateToken(String(user._id)),user:publicUser(user)});
};
export const loginUser=async(req:Request,res:Response)=>{
 const address=email(req.body.email),password=req.body.password;
 if(typeof password!=='string'||Buffer.byteLength(password)>72)throw new HttpError(400,'Invalid password');
 const user=await User.findOne({email:address});
 if(!user||!await bcrypt.compare(password,user.password))throw new HttpError(401,'Invalid email or password');
 res.json({success:true,token:generateToken(String(user._id)),user:publicUser(user)});
};
export const getUserData=async(req:Request,res:Response)=>{res.json({success:true,user:publicUser(req.user)});};
export const getAllServices=async(req:Request,res:Response)=>{
 const filter:any={availability:true,archived:{$ne:true}};
 if(typeof req.query.category==='string')filter.category={$regex:`^${req.query.category.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}$`,$options:'i'};
 res.json({success:true,services:await withRatings(await Service.find(filter).sort({createdAt:-1}))});
};
export const getService=async(req:Request,res:Response)=>{
 const service=await Service.findOne({_id:id(req.params.id),archived:{$ne:true}}).populate('provider','name image');
 if(!service)throw new HttpError(404,'This service is no longer listed');
 const reviews=await Booking.find({service:service._id,status:'completed',rating:{$gte:1}}).select('rating feedback createdAt user').populate('user','name').sort({createdAt:-1}).limit(30);
 res.json({success:true,service:(await withRatings([service]))[0],reviews});
};
