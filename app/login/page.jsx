'use client';
import {useState} from 'react';
import {supa} from '@/lib/browser';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
export default function LoginAdmin(){
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[msg,setMsg]=useState('');
 const router=useRouter();
 async function submit(e){e.preventDefault();setMsg('Memeriksa admin...');try{
   const {data,error}=await supa().auth.signInWithPassword({email,password});if(error)throw error;
   if(!data.session)throw Error('Login admin belum terkonfirmasi');
   // Verify access server-side before redirecting to the owner-only menu.
   const {authFetch}=await import('@/lib/browser');await authFetch('/api/manual/admin');
   router.replace('/admin');
 }catch(e){setMsg(e.message==='Akses ditolak'?'Akun ini bukan admin VIZEX.':'Login admin gagal: '+e.message)}}
 return <main className="auth-wrap"><Link className="brand" href="/">vizex.</Link><form onSubmit={submit} className="auth-card"><span className="eyebrow">KHUSUS PEMILIK VIZEX</span><h1>Login Admin VIZEX</h1><p>Halaman ini untuk pemilik studio. Pelanggan tidak perlu membuat akun.</p><label>Email Admin<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Kata sandi<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="primary">Masuk ke Admin</button><p className="hint" role="status">{msg}</p><Link href="/">← Kembali ke website</Link></form></main>;
}
