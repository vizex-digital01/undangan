'use client';
import {createClient} from '@supabase/supabase-js';
let instance;
export function supa(){if(!instance)instance=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);return instance}
export async function authFetch(path,options={}){const {data:{session}}=await supa().auth.getSession();if(!session)throw Error('Silakan login dahulu');const h=new Headers(options.headers||{});h.set('Authorization','Bearer '+session.access_token);const r=await fetch(path,{...options,headers:h});const j=await r.json().catch(()=>({error:'Server gagal memproses respons'}));if(!r.ok)throw Error(j.error||'Permintaan gagal');return j}
