import {admin,fail,response,signedIn} from '@/lib/server';
import {isAdmin} from '@/lib/manual';
import {sameOrigin} from '@/lib/guest';
import {templates,packages} from '@/lib/catalog';

export async function authorized(req, mutating=false){
 if(mutating&&!sameOrigin(req))return {error:fail('Origin tidak diizinkan',403)};
 const u=await signedIn(req);
 if(!u)return {error:fail('Login admin diperlukan',401)};
 if(!isAdmin(u))return {error:fail('Akses admin ditolak',403)};
 return {user:u,db:admin()};
}
export const short=(v,max=120)=>String(v??'').trim().slice(0,max);
export async function audit(db,user,action,type,id,details={}){
 const {error}=await db.from('vizex_admin_audit').insert({admin_id:user.id,action,entity_type:type,entity_id:String(id),details});
 if(error)throw error;
}
export async function notify(db,kind,title,entity_id,detail=''){
 const {error}=await db.from('vizex_admin_events').insert({kind,title,entity_id:String(entity_id),detail});
 if(error)console.error('Notification insert failed',error.message);
}
export async function effectiveTemplates(db){
 const {data,error}=await db.from('vizex_template_settings').select('template_id,is_active,display_name,description');if(error)throw error;
 const map=new Map((data||[]).map(x=>[x.template_id,x]));
 return templates.map(t=>{const x=map.get(t.id);return {...t,name:x?.display_name||t.name,description:x?.description||t.description,is_active:x?.is_active??true,price:packages[t.tier].price}});
}
export async function guardTemplate(db,id){const all=await effectiveTemplates(db);return all.find(t=>t.id===id&&t.is_active)||null}
