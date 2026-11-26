import mongoose, { Schema } from 'mongoose';
const bookingSchema=new Schema({
 service:{type:Schema.Types.ObjectId,ref:'Service',required:true},user:{type:Schema.Types.ObjectId,ref:'User',required:true},provider:{type:Schema.Types.ObjectId,ref:'User',required:true},
 date:{type:Date,required:true},time:{type:String,enum:['9-11','11-1','2-4','4-6'],required:true},price:{type:Number,required:true,min:0},
 status:{type:String,enum:['pending','confirmed','cancelled','completed'],default:'pending'},active:{type:Boolean,default:true},
 address:{type:String,required:true,maxlength:500},phone:{type:String,required:true},notes:{type:String,default:'',maxlength:1000},
 paymentMethod:{type:String,enum:['cash','demo_gpay'],default:null},paymentStatus:{type:String,enum:['unpaid','cash_pending','paid','demo_paid'],default:'unpaid'},paidAt:{type:Date,default:null},
 feedback:{type:String,default:'',maxlength:2000},rating:{type:Number,min:0,max:5,default:0},
 serviceSnapshot:{title:String,image:String,category:String,service_area:String,staffCount:Number},
},{timestamps:true});
// One provider team per fixed two-hour slot, including concurrent requests across services.
bookingSchema.index({provider:1,date:1,time:1},{unique:true,partialFilterExpression:{active:true}});
export default mongoose.model('Booking',bookingSchema);
