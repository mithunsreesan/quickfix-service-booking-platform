import express from 'express';
import {rateLimit} from 'express-rate-limit';
import {getAllServices,getService,getUserData,loginUser,registerUser} from '../controller/userController.js';
import {protect} from '../middleware/auth.js';
const r=express.Router();const authLimit=rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:true,legacyHeaders:false,message:{success:false,message:'Too many login attempts; try again later'}});
r.post('/register',authLimit,registerUser);r.post('/login',authLimit,loginUser);r.get('/data',protect,getUserData);r.get('/services',getAllServices);r.get('/services/:id',getService);export default r;
