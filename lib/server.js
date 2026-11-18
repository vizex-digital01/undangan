import {createClient} from '@supabase/supabase-js';
export function admin(){if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY)throw Error('Supabase server environment belum diatur');return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})}
export async function signedIn(req){const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');if(!token)return null;const {data,error}=await admin().auth.getUser(token);return error?null:data.user}
export const response=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export const fail=(msg,status=400)=>response({error:msg},status);
export function slugify(s){return String(s||'undangan').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,55)}
