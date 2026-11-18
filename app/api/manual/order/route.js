import {admin,response,fail} from '@/lib/server';
import {visitor,sameOrigin,validId} from '@/lib/guest';
import {cost,bank,safeMessage} from '@/lib/manual';
export async function POST(req){try{
 if(!sameOrigin(req))return fail('Origin tidak diizinkan',403);
 const guest=await visitor(req);if(!guest)return fail('Sesi tidak tersedia',401);
 const {id}=await req.json();if(!validId(id))return fail('ID undangan salah');
 const db=admin(),{data:inv,error:invErr}=await db.from('invitations').select('id,guest_id,status,slug,template_id').eq('id',id).eq('guest_id',guest.guestId).maybeSingle();
 if(invErr)throw invErr;if(!inv)return fail('Undangan tidak ditemukan',404);
 if(inv.status==='published')return response({published:true,url:'/invite/'+inv.slug});
 const account=bank(),amount=cost(inv);
 const {data:existing,error:findErr}=await db.from('orders').select('id,status,amount,proof_path').eq('invitation_id',id).eq('guest_id',guest.guestId).eq('payment_method','seabank_manual').in('status',['pending','submitted']).order('created_at',{ascending:false}).limit(1);
 if(findErr)throw findErr;let order=existing?.[0];
 if(!order){const {data,error}=await db.from('orders').insert({id:'VZX-SB-'+crypto.randomUUID(),invitation_id:id,guest_id:guest.guestId,user_id:null,amount,status:'pending',payment_method:'seabank_manual'}).select('id,status,amount,proof_path').single();if(error)throw error;order=data;}
 return response({orderId:order.id,status:order.status,amount:order.amount,hasProof:!!order.proof_path,...account});
}catch(e){return fail(safeMessage(e),500)}}
