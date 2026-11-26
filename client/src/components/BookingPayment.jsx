import {useEffect,useState} from 'react';
import {useAppContext} from '../context/AppContext';
import toast from 'react-hot-toast';
export default function BookingPayment({booking:b,provider=false,onUpdate}){
 const {axios}=useAppContext();const [busy,setBusy]=useState(false),[qr,setQr]=useState(false),[demo,setDemo]=useState(false);
 useEffect(()=>{axios.get('/api/bookings/payment-config').then(r=>setDemo(r.data.demoPayments)).catch(()=>{});},[axios]);
 const submit=async(method)=>{setBusy(true);try{await axios.post(provider?'/api/bookings/confirm-cash':'/api/bookings/payment',{bookingId:b._id,method});setQr(false);await onUpdate();}catch(e){toast.error(e.response?.data?.message||'Payment update failed')}finally{setBusy(false)}};
 if(b.status!=='completed')return null;
 const status=b.paymentStatus||'unpaid';
 return <div className="my-4 border-t border-slate-200 pt-4">
 {status==='paid'?<p className="text-green-700">Cash received ✓</p>:status==='demo_paid'?<p className="text-blue-700">Demo payment completed — no money transferred</p>:status==='cash_pending'?<><p>Cash selected · Awaiting provider confirmation</p>{provider&&<button disabled={busy} className="qf-button" onClick={()=>window.confirm('Confirm you received the cash?')&&submit()}>Confirm cash received</button>}</>:provider?<p>Awaiting customer payment choice</p>:<><p className="font-semibold">Pay now · ₹{b.price.toFixed(2)}</p><div className="qf-actions"><button disabled={busy} className="qf-outline" onClick={()=>submit('cash')}>Cash</button>{demo&&<button disabled={busy} className="qf-button" onClick={()=>setQr(!qr)}>Google Pay (demo)</button>}</div>{qr&&<div className="mt-4 p-4 bg-slate-50 rounded-lg"><strong>Demo only — no real payment</strong><img src="/demo-qr.svg" alt="Dummy QR code for the QuickFix demonstration, not a payment address" className="w-44 h-44 my-3"/><p>Scanning this code does not transfer money.</p><button disabled={busy} className="qf-button" onClick={()=>submit('demo_gpay')}>{busy?'Saving…':'Simulate payment'}</button></div>}</>}
 </div>;
}
