import bcrypt from 'bcrypt';import {mkdir,copyFile} from 'node:fs/promises';import path from 'node:path';import User from './model/User.js';import Service from './model/Service.js';import Booking from './model/Booking.js';import {uploadDirectory} from './config/imageKit.js';
export async function seed(){
 await Promise.all([User.init(),Booking.init()]);
 const password='QuickFixDemo2026!';
 let provider=await User.findOne({email:'provider@example.test'});
 if(!provider)provider=await User.create({name:'Demo Provider',email:'provider@example.test',password:await bcrypt.hash(password,12),role:'provider'});
 if(!await User.exists({email:'customer@example.test'}))await User.create({name:'Demo Customer',email:'customer@example.test',password:await bcrypt.hash(password,12)});
 if(!await User.exists({email:'admin@example.test'}))await User.create({name:'QuickFix Admin',email:'admin@example.test',password:await bcrypt.hash(password,12),role:'admin'});
 const entries=[['Home Deep Cleaning','Cleaning',350,'service_image1.jpeg'],['Plumbing & Leak Repair','Plumbing',450,'service_image2.jpeg'],['Electrical Maintenance','Electrical',500,'service_image3.jpeg'],['Furniture Assembly','Carpentry',300,'service_image4.jpeg']];
 await mkdir(uploadDirectory,{recursive:true});
 for(const [title,category,price,file] of entries){if(await Service.exists({provider:provider._id,title}))continue;await copyFile(path.resolve('../client/src/assets/'+file),path.join(uploadDirectory,String(file)));await Service.create({provider:provider._id,title,category,price,service_area:'Payyanur',image:'/uploads/'+file,description:'Sample listing for the QuickFix college-project demo. Book a fixed two-hour visit to test the customer and provider workflows.',toolProvided:true,staffCount:1});}
 // Two past appointments make the completion/payment workflow easy to demonstrate.
 const customer=await User.findOne({email:'customer@example.test'});
 const sample=await Service.findOne({provider:provider._id});
 if(customer&&sample){for(const [time,label] of [['9-11','Cash'],['11-1','Google Pay']]){
  const notes='QuickFix payment demo: '+label;
  if(!await Booking.exists({user:customer._id,provider:provider._id,notes})){
   const date=new Date();date.setUTCDate(date.getUTCDate()-1);date.setUTCHours(0,0,0,0);
   if(!await Booking.exists({provider:provider._id,date,time,active:true}))await Booking.create({service:sample._id,user:customer._id,provider:provider._id,date,time,price:sample.price*2,status:'confirmed',address:'Demo address, Payyanur',phone:'9999999999',notes,serviceSnapshot:{title:sample.title,image:sample.image,category:sample.category,service_area:sample.service_area,staffCount:sample.staffCount}});
  }
 }}
 console.log('Demo accounts: customer@example.test / provider@example.test / admin@example.test — password: QuickFixDemo2026!');
}
