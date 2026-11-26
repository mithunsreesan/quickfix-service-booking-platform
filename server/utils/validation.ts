export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
export const text = (value: unknown, name: string, max = 2000) => {
 if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new HttpError(400, `${name} is required (maximum ${max} characters)`);
 return value.trim();
};
export const id = (value: unknown) => { if (typeof value !== 'string' || !/^[a-f\d]{24}$/i.test(value)) throw new HttpError(400, 'Invalid ID'); return value; };
export const email = (value: unknown) => { const v=text(value,'Email',254).toLowerCase(); if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) throw new HttpError(400,'Enter a valid email'); return v; };
export const slots: Record<string,number> = {'9-11':9,'11-1':11,'2-4':14,'4-6':16};
// Booking dates and times always use India Standard Time, irrespective of server/browser timezone.
export const slotDate = (day: unknown, time: unknown, future=true) => {
 if(typeof day !== 'string'||!/^\d{4}-\d{2}-\d{2}$/.test(day)||typeof time!=='string'||!(time in slots)) throw new HttpError(400,'Choose a valid date and time slot');
 const date=new Date(day+'T00:00:00.000Z');
 if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==day) throw new HttpError(400,'Invalid date');
 const starts=new Date(`${day}T${String(slots[time]).padStart(2,'0')}:00:00+05:30`);
 if(future && starts.getTime()<=Date.now()) throw new HttpError(400,'Choose a future time slot');
 return {date,starts,time};
};
export const serviceInput = (body: any) => {
 const raw= typeof body.service==='string'? JSON.parse(body.service):body.service||body;
 const price=Number(raw.pricePerHour??raw.price),staff=Number(raw.staffCount??1);
 if(!Number.isFinite(price)||price<=0||price>100000||!Number.isInteger(staff)||staff<1||staff>100) throw new HttpError(400,'Price must be between 0 and 100000; staff must be 1–100');
 const categories=['Electrical','Plumbing','Cleaning','Appliance Repair','Painting','Carpentry','Pest Control','AC Services','Gardening','Other'];
 if(!categories.includes(raw.category)) throw new HttpError(400,'Choose a listed category');
 return {title:text(raw.title,'Title',100),description:text(raw.description,'Description',3000),category:raw.category,price:Math.round(price*100)/100,service_area:text(raw.serviceArea??raw.service_area,'Service area',120),staffCount:staff,toolProvided:raw.toolsProvided===true||raw.toolProvided===true};
};
