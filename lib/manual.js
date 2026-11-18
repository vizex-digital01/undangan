import {admin, signedIn, fail} from '@/lib/server';
import {packages, templateById} from '@/lib/catalog';
export async function owner(req) { return signedIn(req); }
export function isAdmin(user){
  const ids = (process.env.VIZEX_ADMIN_USER_IDS||'').split(',').map(s=>s.trim()).filter(Boolean);
  return Boolean(user && ids.length && ids.includes(user.id));
}
export async function findDraft(user,id){
  if(typeof id!=='string'||!/^[0-9a-f-]{36}$/i.test(id))return null;
  const {data,error}=await admin().from('invitations').select('id,user_id,status,slug,template_id').eq('id',id).eq('user_id',user.id).maybeSingle();
  if(error)throw error;return data;
}
export function cost(inv){const t=templateById(inv.template_id);if(!t)throw Error('Template tidak ditemukan');return packages[t.tier].price}
export function bank(){const account=process.env.SEABANK_ACCOUNT_NUMBER;const name=process.env.SEABANK_ACCOUNT_NAME;if(!account||!name)throw Error('Rekening SeaBank belum diatur di Vercel');return {bankName:'SeaBank',accountNumber:account,accountName:name}}
export function safeMessage(e){return e?.message==='Rekening SeaBank belum diatur di Vercel'?e.message:'Proses pembayaran gagal. Silakan coba lagi.'}
