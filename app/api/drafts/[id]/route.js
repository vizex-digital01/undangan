import {admin,signedIn,response,fail} from '@/lib/server';
import {starterData} from '@/lib/catalog';
const fields=Object.keys(starterData).filter(x=>x!=='photos');
export async function GET(req,{params}){try{const user=await signedIn(req);if(!user)return fail('Login diperlukan',401);const {id}=await params;const {data,error}=await admin().from('invitations').select('*').eq('id',id).eq('user_id',user.id).single();if(error||!data)return fail('Draft tidak ditemukan',404);const paths=Array.isArray(data.data?.photos)?data.data.photos:[];const signed=paths.length?await admin().storage.from('invite-photos').createSignedUrls(paths,3600):{data:[]};return response({...data,previewPhotos:(signed.data||[]).map(x=>x.signedUrl).filter(Boolean)})}catch{return fail('Gagal memuat draft',500)}}
export async function PATCH(req,{params}){try{const user=await signedIn(req);if(!user)return fail('Login diperlukan',401);const {id}=await params;const db=admin();const {data:old}=await db.from('invitations').select('*').eq('id',id).eq('user_id',user.id).single();if(!old)return fail('Draft tidak ditemukan',404);const input=await req.json();const updates={...old.data};for(const f of fields){if(typeof input[f]==='string')updates[f]=input[f].slice(0,f==='story'?1200:300)}const {error}=await db.from('invitations').update({data:updates,updated_at:new Date().toISOString()}).eq('id',id).eq('user_id',user.id);if(error)throw error;return response({ok:true})}catch{return fail('Gagal menyimpan perubahan',500)}}

export async function DELETE(req,{params}){try{
 const user=await signedIn(req);if(!user)return fail('Login diperlukan',401);
 const {id}=await params;const {path}=await req.json();
 if(typeof path!=='string'||!path.startsWith(`${user.id}/${id}/`))return fail('Path foto tidak valid');
 const db=admin();const {data:inv,error:findError}=await db.from('invitations').select('data').eq('id',id).eq('user_id',user.id).single();
 if(findError||!inv)return fail('Draft tidak ditemukan',404);
 const photos=Array.isArray(inv.data?.photos)?inv.data.photos:[];if(!photos.includes(path))return fail('Foto tidak ditemukan',404);
 const next=photos.filter(p=>p!==path);const {error}=await db.from('invitations').update({data:{...inv.data,photos:next},updated_at:new Date().toISOString()}).eq('id',id).eq('user_id',user.id);
 if(error)throw error;await db.storage.from('invite-photos').remove([path]);return response({ok:true,photos:next});
 }catch{return fail('Gagal menghapus foto',500)}}
