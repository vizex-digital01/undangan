import {admin,response,fail,slugify} from '@/lib/server';
import {visitor,createVisitor,attachCookie,sameOrigin} from '@/lib/guest';
import {starterData} from '@/lib/catalog';
import {guardTemplate} from '@/lib/admin-v13';
export async function GET(req){try{
 const guest=await visitor(req);if(!guest)return response({items:[]});
 const {data,error}=await admin().from('invitations').select('id,slug,template_id,status,created_at,data').eq('guest_id',guest.guestId).order('created_at',{ascending:false});
 if(error)throw error;return response({items:data||[]});
}catch{return fail('Gagal memuat draft',500)}}
export async function POST(req){try{
 if(!sameOrigin(req))return fail('Origin tidak diizinkan',403);
 const body=await req.json();const template=await guardTemplate(admin(),body.template_id);if(!template)return fail('Template tidak valid');
 let guest=await visitor(req),token=null;
 if(!guest){guest=await createVisitor();token=guest.token;}
 const id=crypto.randomUUID(),slug=slugify('undangan-'+id.slice(0,8));
 const {data,error}=await admin().from('invitations').insert({id,guest_id:guest.guestId,user_id:null,slug,template_id:template.id,data:starterData,status:'draft'}).select('id').single();
 if(error)throw error;return attachCookie(response(data,201),token);
}catch{return fail('Gagal membuat draft',500)}}
