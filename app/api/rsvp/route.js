import {admin,response,fail} from '@/lib/server';
import {sameOrigin,validId} from '@/lib/guest';
import {randomBytes,createHash} from 'node:crypto';
const cookieName='vizex_rsvp';
function cookie(req){const v=req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1);return v&&/^[a-f0-9]{64}$/i.test(v)?v:null}
export async function POST(req){try{
 if(!sameOrigin(req))return fail('Origin ditolak',403);
 const body=await req.json();const id=body.invitationId;
 if(!validId(id))return fail('Undangan tidak ditemukan',404);
 const name=typeof body.name==='string'?body.name.trim().slice(0,100):'';
 const attendance=body.attendance;const size=attendance==='hadir'?Number(body.partySize):0;
 const wish=typeof body.wish==='string'?body.wish.trim().slice(0,500):'';
 if(!name||!['hadir','tidak','ragu'].includes(attendance)||!Number.isInteger(size)||size<0||size>4||(attendance==='hadir'&&size<1))return fail('Isi konfirmasi dengan benar');
 const db=admin();const {data:inv,error:ie}=await db.from('invitations').select('id').eq('id',id).eq('status','published').maybeSingle();if(ie)throw ie;if(!inv)return fail('Undangan belum aktif',403);
 const token=cookie(req)||randomBytes(32).toString('hex');const hash=createHash('sha256').update(token).digest('hex');
 const {data:prior,error:pe}=await db.from('vizex_rsvp').select('id,updated_at').eq('invitation_id',id).eq('respondent_hash',hash).maybeSingle();if(pe)throw pe;
 if(prior&&Date.now()-new Date(prior.updated_at).getTime()<30000)return fail('Tunggu sebentar sebelum mengubah konfirmasi',429);
 const {error}=await db.from('vizex_rsvp').upsert({invitation_id:id,respondent_hash:hash,guest_name:name,attendance,party_size:size,wish,updated_at:new Date().toISOString()},{onConflict:'invitation_id,respondent_hash'});if(error)throw error;
 const out=response({ok:true,message:'Konfirmasi kehadiran tersimpan.'});
 if(!cookie(req))out.headers.append('Set-Cookie',`${cookieName}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`);
 return out;
 }catch(e){console.error('RSVP submit failed',e);return fail('Konfirmasi belum dapat disimpan',500)} }
