import Booking from '../model/Booking.js';
export async function withRatings(services:any[]){
 const stats=await Booking.aggregate([{$match:{service:{$in:services.map(s=>s._id)},status:'completed',rating:{$gte:1}}},{$group:{_id:'$service',average:{$avg:'$rating'},count:{$sum:1}}}]);
 return services.map(s=>{const stat=stats.find(r=>String(r._id)===String(s._id));return {...s.toObject(),service_rating:stat?.average||0,service_rating_count:stat?.count||0};});
}
