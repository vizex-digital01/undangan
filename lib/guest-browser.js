'use client';
export async function guestFetch(path,options={}){
  const r=await fetch(path,{...options,credentials:'same-origin',cache:'no-store'});
  const j=await r.json().catch(()=>({error:'Respons server tidak valid'}));
  if(!r.ok)throw Error(j.error||'Permintaan gagal');
  return j;
}
