import {admin,response,fail} from '@/lib/server';
import {visitor,sameOrigin,validId} from '@/lib/guest';
export async function POST(req){try{
 if(!sameOrigin(req))return fail('Origin tidak diizinkan',403);
 const guest=await visitor(req);if(!guest)return fail('Sesi undangan tidak ditemukan. Gunakan browser yang sama.',401);
 const form=await req.formData(),id=String(form.get('id')||''),file=form.get('photo');
 if(!validId(id)||!file||typeof file==='string')return fail('File tidak ditemukan');
 const types={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
 if(!types[file.type])return fail('Format foto tidak didukung');if(!file.size||file.size>4*1024*1024)return fail('Foto maksimal 4 MB');
 const db=admin(),{data:inv}=await db.from('invitations').select('data').eq('id',id).eq('guest_id',guest.guestId).maybeSingle();if(!inv)return fail('Draft tidak ditemukan',404);
 const photos=Array.isArray(inv.data?.photos)?inv.data.photos:[];if(photos.length>=12)return fail('Maksimal 12 foto');
 const path=`guest/${guest.guestId}/${id}/${crypto.randomUUID()}.${types[file.type]}`;
 const {error:up}=await db.storage.from('invite-photos').upload(path,await file.arrayBuffer(),{contentType:file.type,upsert:false});if(up)throw up;
 const updated=[...photos,path],{error}=await db.from('invitations').update({data:{...inv.data,photos:updated}}).eq('id',id).eq('guest_id',guest.guestId);
 if(error){await db.storage.from('invite-photos').remove([path]);throw error;}return response({path,photos:updated});
}catch{return fail('Upload foto gagal',500)}}
