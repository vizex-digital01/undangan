import {admin,response,fail} from '@/lib/server';
import {visitor,validId} from '@/lib/guest';
export async function GET(req){try{
 const id=new URL(req.url).searchParams.get('invitationId');if(!validId(id))return fail('ID undangan salah');
 const guest=await visitor(req);if(!guest)return fail('Sesi pembuat undangan tidak ditemukan',401);
 const db=admin(),{data:inv,error:ie}=await db.from('invitations').select('id,slug,status,data').eq('id',id).eq('guest_id',guest.guestId).maybeSingle();if(ie)throw ie;if(!inv)return fail('Tidak berhak melihat daftar tamu',403);
 const {data,error}=await db.from('vizex_rsvp').select('id,guest_name,attendance,party_size,wish,created_at,updated_at').eq('invitation_id',id).order('updated_at',{ascending:false}).limit(1000);if(error)throw error;
 const items=data||[];const counts={hadir:items.filter(x=>x.attendance==='hadir').length,tidak:items.filter(x=>x.attendance==='tidak').length,ragu:items.filter(x=>x.attendance==='ragu').length,people:items.reduce((sum,x)=>sum+(x.attendance==='hadir'?Number(x.party_size||0):0),0)};
 return response({invitation:{id:inv.id,slug:inv.slug,status:inv.status,couple1:inv.data?.couple1,couple2:inv.data?.couple2,eventTitle:inv.data?.eventTitle,celebrant:inv.data?.celebrant},counts,items,truncated:items.length===1000});
 }catch(e){console.error('RSVP owner GET failed',e);return fail('Gagal memuat daftar kehadiran',500)} }
