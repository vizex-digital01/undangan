import {authorized,short,audit,notify} from '@/lib/admin-v13';
import {response,fail} from '@/lib/server';
import {templates} from '@/lib/catalog';
export async function POST(req){
 try{
  const ctx=await authorized(req,true);if(ctx.error)return ctx.error;
  const {db,user}=ctx,body=await req.json(),action=String(body.action||'');
  if(action==='template'){
   const id=short(body.id,60);if(!templates.some(x=>x.id===id))return fail('Template tidak tersedia');
   if(typeof body.active!=='boolean'||typeof body.name!=='string'||typeof body.description!=='string')return fail('Data template salah');
   const payload={template_id:id,is_active:body.active,display_name:short(body.name,80),description:short(body.description,180),updated_at:new Date().toISOString()};
   const {error}=await db.from('vizex_template_settings').upsert(payload,{onConflict:'template_id'});if(error)throw error;
   await audit(db,user,'update_template','template',id,{active:payload.is_active});return response({ok:true});
  }
  if(action==='settings'){
   const allowed=new Set(['support_whatsapp','support_email','announcement']);
   if(!allowed.has(body.key)||typeof body.value!=='string')return fail('Pengaturan tidak tersedia');
   const value=short(body.value,body.key==='announcement'?240:100);
   if(body.key==='support_whatsapp'&&value&&!/^\+?[0-9]{8,16}$/.test(value))return fail('Nomor WhatsApp tidak valid');
   if(body.key==='support_email'&&value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))return fail('Email tidak valid');
   const {error}=await db.from('vizex_site_settings').upsert({key:body.key,value,updated_at:new Date().toISOString()},{onConflict:'key'});if(error)throw error;
   await audit(db,user,'update_settings','setting',body.key,{});return response({ok:true});
  }
  if(action==='invitation'){
   const id=short(body.id,50),next=body.status;
   if(!/^[0-9a-f-]{36}$/i.test(id)||!['draft','published'].includes(next))return fail('Permintaan tidak valid');
   const {data:inv,error:ie}=await db.from('invitations').select('id,status').eq('id',id).maybeSingle();if(ie)throw ie;if(!inv)return fail('Undangan tidak ditemukan',404);
   if(next==='published'){
     const {data:paid,error:pe}=await db.from('orders').select('id').eq('invitation_id',id).eq('status','paid').limit(1);if(pe)throw pe;
     if(!paid?.length)return fail('Tidak boleh menerbitkan undangan yang belum dibayar',409);
   }
   const {error}=await db.from('invitations').update({status:next,updated_at:new Date().toISOString()}).eq('id',id);if(error)throw error;
   await audit(db,user,'set_invitation_status','invitation',id,{before:inv.status,after:next});
   await notify(db,'invitation','Status undangan diperbarui',id,`Status: ${next}`);return response({ok:true});
  }
  if(action==='read_event'){
   const id=short(body.id,50);if(!/^[0-9a-f-]{36}$/i.test(id))return fail('ID notifikasi salah');
   const {error}=await db.from('vizex_admin_events').update({seen_at:new Date().toISOString()}).eq('id',id);if(error)throw error;return response({ok:true});
  }
  return fail('Tindakan tidak tersedia',404);
 }catch(e){console.error('admin v13 POST',e);return fail('Gagal menyimpan perubahan admin',500)}
}
