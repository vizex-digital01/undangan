import {authorized,effectiveTemplates} from '@/lib/admin-v13';
import {response,fail} from '@/lib/server';
export const dynamic='force-dynamic';
const validTabs=new Set(['overview','orders','invitations','templates','customers','analytics','settings','notifications','audit']);
export async function GET(req){
 try{
  const {error,db}=await authorized(req);if(error)return error;
  const url=new URL(req.url),tab=url.searchParams.get('tab')||'overview';if(!validTabs.has(tab))return fail('Menu tidak tersedia',404);
  if(tab==='templates')return response({templates:await effectiveTemplates(db)});
  if(tab==='settings'){
   const {data,error:e}=await db.from('vizex_site_settings').select('key,value,updated_at').order('key');if(e)throw e;
   return response({settings:data||[],bankConfigured:!!(process.env.SEABANK_ACCOUNT_NUMBER&&process.env.SEABANK_ACCOUNT_NAME)});
  }
  if(tab==='notifications'){
   const {data,error:e}=await db.from('vizex_admin_events').select('*').order('created_at',{ascending:false}).limit(150);if(e)throw e;
   const {data:pending,error:pe}=await db.from('orders').select('id,amount,submitted_at').eq('payment_method','seabank_manual').eq('status','submitted').order('submitted_at',{ascending:false}).limit(100);if(pe)throw pe;
   return response({events:data||[],pending:pending||[]});
  }
  if(tab==='audit'){
   const {data,error:e}=await db.from('vizex_admin_audit').select('*').order('created_at',{ascending:false}).limit(100);if(e)throw e;return response({audit:data||[]});
  }
  // Paginated admin-only data, no proof URLs exposed from this endpoint.
  const limit=tab==='analytics'||tab==='overview'?1000:100;
  const [a,b]=await Promise.all([
   db.from('invitations').select('id,slug,template_id,status,customer_name,customer_whatsapp,data,created_at,updated_at').order('created_at',{ascending:false}).limit(limit),
   db.from('orders').select('id,invitation_id,amount,status,payment_method,created_at,submitted_at,reviewed_at').order('created_at',{ascending:false}).limit(limit)
  ]);
  if(a.error)throw a.error;if(b.error)throw b.error;
  const invitations=(a.data||[]).map(({data,...x})=>({...x,couple1:String(data?.couple1||''),couple2:String(data?.couple2||''),eventDate:String(data?.date||'')}));
  const orders=b.data||[],byInvite=new Map(invitations.map(x=>[x.id,x]));
  const detailed=orders.map(o=>({...o,invitation:byInvite.get(o.invitation_id)||null}));
  if(tab==='orders')return response({orders:detailed,hasMore:orders.length===limit});
  if(tab==='invitations')return response({invitations,hasMore:invitations.length===limit});
  if(tab==='customers'){
   return response({customers:invitations.filter(x=>x.customer_name||x.customer_whatsapp).map(x=>({id:x.id,name:x.customer_name,whatsapp:x.customer_whatsapp,created_at:x.created_at,slug:x.slug,status:x.status,order:detailed.find(o=>o.invitation_id===x.id)?.status||'draft'})),hasMore:invitations.length===limit});
  }
  const paid=orders.filter(o=>o.status==='paid'),total=paid.reduce((sum,o)=>sum+Number(o.amount||0),0),submitted=orders.filter(o=>o.status==='submitted');
  const currentMonth=new Date().toISOString().slice(0,7);
  const monthly=Array.from({length:6},(_,i)=>{const now=new Date();const d=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-5+i,1));const key=d.toISOString().slice(0,7);return {month:key,orders:orders.filter(o=>o.created_at?.startsWith(key)).length,revenue:paid.filter(o=>(o.reviewed_at||o.created_at)?.startsWith(key)).reduce((s,o)=>s+Number(o.amount),0)};});
  const counts={draft:invitations.filter(x=>x.status==='draft').length,published:invitations.filter(x=>x.status==='published').length};
  const templateCounts=Object.entries(invitations.reduce((m,x)=>(m[x.template_id]=(m[x.template_id]||0)+1,m),{})).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([name,count])=>({name,count}));
  return response({stats:{orders:orders.length,submitted:submitted.length,paid:paid.length,rejected:orders.filter(x=>x.status==='rejected').length,revenue:total, ...counts,monthly,templateCounts},recentOrders:detailed.slice(0,8),hasMore:orders.length===limit||invitations.length===limit});
 }catch(e){console.error('admin v13 GET',e);return fail('Gagal memuat menu admin. Pastikan migrasi v13 dijalankan.',500)}
}
