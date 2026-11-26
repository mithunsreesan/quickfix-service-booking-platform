import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {useAppContext} from '../context/AppContext';
export default function Admin(){
 const {user,authLoading,setShowLogin,axios}=useAppContext();
 const [data,setData]=useState(null),[error,setError]=useState(''),[tab,setTab]=useState('Customers'),[search,setSearch]=useState(''),[person,setPerson]=useState('');
 const load=async()=>{setError('');try{setData((await axios.get('/api/admin/overview')).data)}catch(e){setError(e.response?.data?.message||'Could not load admin data')}};
 useEffect(()=>{if(user?.role==='admin')load();},[user]);
 if(authLoading)return <main className="qf-page">Loading account…</main>;
 if(!user)return <main className="qf-page"><h1>Admin login</h1><p>Sign in with your administrator account.</p><button className="qf-button" onClick={()=>setShowLogin(true)}>Sign in</button></main>;
 if(user.role!=='admin')return <main className="qf-page"><h1>Admin access required</h1><p>This account does not have administrator permissions.</p><Link to="/">Return home</Link></main>;
 const users=data?.users||[],services=data?.services||[],bookings=data?.bookings||[];
 const selectPerson=(id)=>{setPerson(id);setTab('Bookings');setSearch('')};
 const matches=(value)=>JSON.stringify(value).toLowerCase().includes(search.toLowerCase());
 return <main className="qf-page"><div className="qf-actions justify-between"><h1>Admin dashboard</h1><Link className="qf-outline" to="/">View customer website</Link><button className="qf-outline" onClick={load}>Refresh</button></div><p>View customers, providers, services and bookings across QuickFix. Account views are read-only.</p>
 {error&&<p role="alert">{error}</p>}{!data&&!error&&<p>Loading dashboard…</p>}
 {data&&<><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[['Customers',users.filter(u=>u.role==='user').length],['Providers',users.filter(u=>u.role==='provider').length],['Services',services.length],['Bookings',bookings.length]].map(([label,count])=><button className="qf-panel text-left" key={label} onClick={()=>{setTab(label);setPerson('')}}><span>{label}</span><strong className="block text-3xl text-blue-600">{count}</strong></button>)}</div>
 <div className="qf-actions" role="tablist" aria-label="Admin sections">{['Customers','Providers','Services','Bookings'].map(t=><button key={t} role="tab" aria-selected={tab===t} className={tab===t?'qf-button':'qf-outline'} onClick={()=>{setTab(t);setPerson('')}}>{t}</button>)}</div>
 <label>Search {tab.toLowerCase()}<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name, email, service or status"/></label>
 {person&&<p>Showing records for {users.find(u=>u._id===person)?.name} <button className="qf-outline" onClick={()=>setPerson('')}>Clear filter</button></p>}
 {['Customers','Providers'].includes(tab)&&<div className="overflow-x-auto"><table className="w-full text-left"><thead><tr><th>Name</th><th>Email</th><th>Account records</th></tr></thead><tbody>{users.filter(u=>u.role===(tab==='Customers'?'user':'provider')&&matches(u)).map(u=><tr className="border-b border-slate-200" key={u._id}><td className="py-4">{u.name}</td><td>{u.email}</td><td><button className="qf-outline" onClick={()=>selectPerson(u._id)}>View bookings</button>{u.role==='provider'&&<button className="qf-outline" onClick={()=>{setPerson(u._id);setTab('Services');setSearch('')}}>View services</button>}</td></tr>)}</tbody></table></div>}
 {tab==='Services'&&services.filter(s=>(!person||s.provider?._id===person)&&matches(s)).map(s=><article key={s._id} className="qf-panel"><h2>{s.title}</h2><p>{s.provider?.name} · {s.provider?.email}</p><p>{s.category} · {s.service_area} · ₹{s.price}/hour</p><p>{s.description}</p><span className="qf-status">{s.archived?'Archived':s.availability?'Available':'Paused'}</span>{!s.archived&&<p><Link to={'/service-details/'+s._id}>View customer service page →</Link></p>}</article>)}
 {tab==='Bookings'&&bookings.filter(b=>(!person||b.user?._id===person||b.provider?._id===person)&&matches(b)).map(b=><article key={b._id} className="qf-panel"><h2>{b.serviceSnapshot?.title||b.service?.title||'Archived service'}</h2><p>Customer: {b.user?.name} · {b.user?.email}</p><p>Provider: {b.provider?.name} · {b.provider?.email}</p><p>{b.date.slice(0,10)} · {b.time} IST · ₹{b.price.toFixed(2)}</p><p>{b.address} · {b.phone}</p><p>Work: {b.status} · Payment: {{unpaid:'Unpaid',cash_pending:'Awaiting cash confirmation',paid:'Cash received',demo_paid:'Demo paid — no real money'}[b.paymentStatus||'unpaid']}</p><small>Booking reference: {b._id}</small></article>)}
 </>}
 </main>;
}
