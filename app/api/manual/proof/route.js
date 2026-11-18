import {admin,response,fail} from '@/lib/server';
import {owner} from '@/lib/manual';
export async function POST(req){try{
 const user=await owner(req);if(!user)return fail('Silakan login',401);
 const form=await req.formData(),id=String(form.get('orderId')||''),file=form.get('file');
 if(!/^VZX-SB-[0-9a-f-]{36}$/i.test(id)||!file||typeof file==='string')return fail('Pesanan atau file tidak valid');
 const types={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','application/pdf':'pdf'};
 if(!types[file.type])return fail('Bukti harus JPG, PNG, WEBP atau PDF');
 if(!file.size||file.size>4*1024*1024)return fail('Bukti maksimal 4 MB');
 const db=admin();const {data:order}=await db.from('orders').select('id,status,proof_path').eq('id',id).eq('user_id',user.id).eq('payment_method','seabank_manual').maybeSingle();
 if(!order)return fail('Pesanan tidak ditemukan',404);
 if(order.status!=='pending')return fail('Bukti sudah dikirim atau pesanan selesai',409);
 const path=`${user.id}/${id}/${crypto.randomUUID()}.${types[file.type]}`;
 const {error:uploadError}=await db.storage.from('payment-proofs').upload(path,file,{contentType:file.type,upsert:false});if(uploadError)throw uploadError;
 // Conditional update prevents accepting repeated submissions; remove orphan file if race.
 const {data:updated,error:updateError}=await db.from('orders').update({proof_path:path,status:'submitted',submitted_at:new Date().toISOString()}).eq('id',id).eq('user_id',user.id).eq('status','pending').select('id').maybeSingle();
 if(updateError||!updated){await db.storage.from('payment-proofs').remove([path]);return fail('Bukti sudah pernah dikirim; muat ulang',409)}
 return response({ok:true,status:'submitted'});
}catch{return fail('Upload bukti gagal',500)}}
