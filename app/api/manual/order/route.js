import {admin,response,fail} from '@/lib/server';
import {owner,findDraft,cost,bank,safeMessage} from '@/lib/manual';
export async function POST(req){try{
 const user=await owner(req);if(!user)return fail('Silakan login',401);
 const {id}=await req.json();const inv=await findDraft(user,id);if(!inv)return fail('Undangan tidak ditemukan',404);
 if(inv.status==='published')return response({published:true,url:'/invite/'+inv.slug});
 const account=bank(),amount=cost(inv),db=admin();
 // Reuse outstanding order; avoid multiple pending orders or price changes from client.
 const {data:existing,error:findErr}=await db.from('orders').select('id,status,amount,proof_path').eq('invitation_id',id).eq('user_id',user.id).eq('payment_method','seabank_manual').in('status',['pending','submitted']).order('created_at',{ascending:false}).limit(1);
 if(findErr)throw findErr;
 let order=existing?.[0];
 if(!order){const {data,error}=await db.from('orders').insert({id:'VZX-SB-'+crypto.randomUUID(),invitation_id:id,user_id:user.id,amount,status:'pending',payment_method:'seabank_manual'}).select('id,status,amount,proof_path').single();if(error)throw error;order=data;}
 return response({orderId:order.id,status:order.status,amount:order.amount,hasProof:!!order.proof_path,...account});
}catch(e){return fail(safeMessage(e),500)}}
