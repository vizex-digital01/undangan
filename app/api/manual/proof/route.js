import {admin,response,fail} from '@/lib/server';
import {visitor,sameOrigin} from '@/lib/guest';
export async function POST(req){try{
 if(!sameOrigin(req))return fail('Origin tidak diizinkan',403);
 const guest=await visitor(req);if(!guest)return fail('Sesi tidak tersedia',401);
 const form=await req.formData(),id=String(form.get('orderId')||''),file=form.get('file');
 if(!/^VZX-SB-[0-9a-f-]{36}$/i.test(id)||!file||typeof file==='string')return fail('Pesanan/file tidak valid');
 const types={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','application/pdf':'pdf'};
 if(!types[file.type]||!file.size||file.size>4*1024*1024)return fail('Gunakan JPG/PNG/WEBP/PDF maksimal 4 MB');
 const db=admin(),{data:order}=await db.from('orders').select('id,status').eq('id',id).eq('guest_id',guest.guestId).eq('payment_method','seabank_manual').maybeSingle();
 if(!order)return fail('Pesanan tidak ditemukan',404);if(order.status!=='pending')return fail('Bukti sudah dikirim',409);
 const path=`guest/${guest.guestId}/${id}/${crypto.randomUUID()}.${types[file.type]}`;
 const {error:up}=await db.storage.from('payment-proofs').upload(path,file,{contentType:file.type,upsert:false});if(up)throw up;
 const {data:updated,error}=await db.from('orders').update({proof_path:path,status:'submitted',submitted_at:new Date().toISOString()}).eq('id',id).eq('guest_id',guest.guestId).eq('status','pending').select('id').maybeSingle();
 if(error||!updated){await db.storage.from('payment-proofs').remove([path]);return fail('Bukti sudah pernah dikirim',409)}
 return response({ok:true,status:'submitted'});
}catch{return fail('Upload bukti gagal',500)}}
