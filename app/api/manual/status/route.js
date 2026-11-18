import {admin,response,fail} from '@/lib/server';
import {visitor,validId} from '@/lib/guest';
export async function GET(req){try{
 const guest=await visitor(req);if(!guest)return fail('Sesi tidak tersedia',401);
 const id=new URL(req.url).searchParams.get('invitationId');if(!validId(id))return fail('ID undangan salah');
 const db=admin(),{data:inv}=await db.from('invitations').select('id,status,slug').eq('id',id).eq('guest_id',guest.guestId).maybeSingle();
 if(!inv)return fail('Undangan tidak ada',404);
 const {data:orders,error}=await db.from('orders').select('id,status,amount,created_at,submitted_at,admin_note').eq('invitation_id',id).eq('guest_id',guest.guestId).eq('payment_method','seabank_manual').order('created_at',{ascending:false}).limit(5);
 if(error)throw error;return response({invitation:inv,orders:orders||[]});
}catch{return fail('Gagal mengambil status',500)}}
