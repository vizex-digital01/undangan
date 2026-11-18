import {admin,response,fail} from '@/lib/server';
import {visitor,sameOrigin,validId} from '@/lib/guest';
import {starterData} from '@/lib/catalog';
const fields=Object.keys(starterData).filter(x=>x!=='photos');
async function find(req,id){
 const guest=await visitor(req);if(!guest||!validId(id))return null;
 const {data,error}=await admin().from('invitations').select('*').eq('id',id).eq('guest_id',guest.guestId).maybeSingle();
 if(error)throw error;return {data,guest};
}
export async function GET(req,{params}){try{
 const {id}=await params;const x=await find(req,id);if(!x?.data)return fail('Draft tidak ditemukan di browser ini',404);
 const paths=Array.isArray(x.data.data?.photos)?x.data.data.photos:[];
 const signed=paths.length?await admin().storage.from('invite-photos').createSignedUrls(paths,3600):{data:[]};
 return response({...x.data,previewPhotos:(signed.data||[]).map(x=>x.signedUrl||null)});
}catch{return fail('Gagal memuat undangan',500)}}
export async function PATCH(req,{params}){try{
 if(!sameOrigin(req))return fail('Origin tidak diizinkan',403);
 const {id}=await params,x=await find(req,id);if(!x?.data)return fail('Draft tidak ditemukan',404);
 const input=await req.json(),updates={...x.data.data};
 for(const f of fields)if(typeof input[f]==='string')updates[f]=input[f].slice(0,f==='story'?1200:300);
 const {error}=await admin().from('invitations').update({data:updates,updated_at:new Date().toISOString()}).eq('id',id).eq('guest_id',x.guest.guestId);
 if(error)throw error;return response({ok:true});
}catch{return fail('Gagal menyimpan',500)}}
export async function DELETE(req,{params}){try{
 if(!sameOrigin(req))return fail('Origin tidak diizinkan',403);
 const {id}=await params,x=await find(req,id);if(!x?.data)return fail('Draft tidak ditemukan',404);
 const {path}=await req.json();
 const photos=Array.isArray(x.data.data?.photos)?x.data.data.photos:[];
 if(typeof path!=='string'||!photos.includes(path)||!path.startsWith(`guest/${x.guest.guestId}/${id}/`))return fail('Foto tidak valid',403);
 const next=photos.filter(p=>p!==path);
 const db=admin();const {error}=await db.from('invitations').update({data:{...x.data.data,photos:next},updated_at:new Date().toISOString()}).eq('id',id).eq('guest_id',x.guest.guestId);
 if(error)throw error;await db.storage.from('invite-photos').remove([path]);return response({ok:true,photos:next});
}catch{return fail('Gagal menghapus foto',500)}}
