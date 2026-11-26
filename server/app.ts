import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {rateLimit} from 'express-rate-limit';
import path from 'node:path';
import {existsSync} from 'node:fs';
import adminRouter from './route/adminRoutes.js';
import userRouter from './route/userRoute.js';
import providerRouter from './route/providerRoutes.js';
import bookingRouter from './route/bookingRoutes.js';
import {uploadDirectory} from './config/imageKit.js';
export const app=express();app.disable('x-powered-by');
app.use(helmet({contentSecurityPolicy:false,crossOriginResourcePolicy:{policy:'cross-origin'}}));
app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173'}));
app.use(express.json({limit:'100kb'}));
app.use('/api',rateLimit({windowMs:60000,limit:300,standardHeaders:true,legacyHeaders:false,message:{success:false,message:'Too many requests. Please wait a minute.'}}));
app.use('/uploads',express.static(uploadDirectory,{dotfiles:'deny',setHeaders:res=>{res.setHeader('X-Content-Type-Options','nosniff');}}));
app.get('/api/health',(_req,res)=>res.json({success:true,name:'QuickFix'}));
app.use('/api/admin',adminRouter);
app.use('/api/user',userRouter);app.use('/api/provider',providerRouter);app.use('/api/bookings',bookingRouter);
app.use('/api',(_req,res)=>res.status(404).json({success:false,message:'API route not found'}));
const client=path.resolve('../client/dist');
if(existsSync(client)){app.use(express.static(client));app.get('/{*path}',(_req,res)=>res.sendFile(path.join(client,'index.html')));}
app.use((err:any,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{
 let status=err.status||500,message=err.message;
 if(err.code===11000){status=409;message=err.keyPattern?.email?'This email is already registered':'That time slot was just booked. Choose another.';}
 if(['ValidationError','CastError','SyntaxError'].includes(err.name)){status=400;message='Invalid request data';}
 if(err.code==='LIMIT_FILE_SIZE'){status=413;message='Image must be smaller than 5 MB';}
 if(status>=500){console.error(err);message='Server error. Please try again.';}
 res.status(status).json({success:false,message});
});
