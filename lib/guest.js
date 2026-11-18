import {randomBytes,createHash} from 'node:crypto';
import {admin,response} from '@/lib/server';

const COOKIE='vizex_guest';
const DAY=86400;
const DAYS=30;
const uuidRe=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const hash=s=>createHash('sha256').update(s).digest('hex');

export function sameOrigin(req){
  const origin=req.headers.get('origin');
  if(!origin)return true;
  try {
    const expected=req.headers.get('x-forwarded-host')||req.headers.get('host')||new URL(req.url).host;
    return new URL(origin).host===expected;
  }catch{return false;}
}
export async function visitor(req){
  const raw=req.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
  if(!raw||!/^[a-f0-9]{64}$/i.test(raw))return null;
  const {data,error}=await admin().from('guest_sessions').select('id,expires_at').eq('token_hash',hash(raw)).gt('expires_at',new Date().toISOString()).maybeSingle();
  if(error)throw error;
  return data?{guestId:data.id}:null;
}
export async function createVisitor(){
  const token=randomBytes(32).toString('hex');
  const {data,error}=await admin().from('guest_sessions').insert({token_hash:hash(token),expires_at:new Date(Date.now()+DAYS*DAY*1000).toISOString()}).select('id').single();
  if(error)throw error;
  return {guestId:data.id,token};
}
export function attachCookie(result,token){
  if(token)result.headers.append('Set-Cookie',`${COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${DAYS*DAY}`);
  return result;
}
export function scoped(q,person){return q.eq('guest_id',person.guestId);}
export const validId=s=>typeof s==='string'&&uuidRe.test(s);
export function safeError(){return response({error:'Tidak dapat memproses permintaan. Periksa koneksi/database VIZEX.'},500)}
