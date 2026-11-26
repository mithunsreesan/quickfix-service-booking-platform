import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import {app} from './app.js';
import Booking from './model/Booking.js';
import User from './model/User.js';
async function start(){
 if(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32)throw new Error('JWT_SECRET must contain at least 32 characters. Run npm run setup from the project root.');
 await connectDB();await Promise.all([Booking.init(),User.init()]);
 const server=app.listen(Number(process.env.PORT)||5000,()=>console.log('QuickFix running on http://localhost:'+(process.env.PORT||5000)));
 const close=()=>server.close(()=>{mongoose.disconnect().then(()=>process.exit(0));});process.on('SIGTERM',close);process.on('SIGINT',close);
}
start().catch(e=>{console.error(e.message);process.exit(1);});
