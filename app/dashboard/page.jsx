'use client';
import {useCallback,useEffect,useState} from 'react';
import {authFetch,supa} from '@/lib/browser';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {templateById} from '@/lib/catalog';
export default function Dashboard(){
 const [items,setItems]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(true);const router=useRouter();
 const load=useCallback(async()=>{setLoading(true);setError('');try{const {data:{session}}=await supa().auth.getSession();if(!session){router.replace('/login');return}const result=await authFetch('/api/drafts');setItems(result.items||[])}catch(e){if(e.message==='Silakan login dahulu'||e.message==='Login diperlukan'){router.replace('/login');return}setError(e.message)}finally{setLoading(false)}},[router]);
 useEffect(()=>{load()},[load]);
 return <main className="app-page"><header><Link href="/" className="brand">vizex.</Link><div><Link href="/#templates">+ Buat baru</Link><button onClick={async()=>{await supa().auth.signOut();router.replace('/login')}}>Keluar</button></div></header><span className="eyebrow">MY INVITATIONS</span><h1>Dashboard Undangan</h1><p>Semua draft tersimpan di akunmu. Link publik baru tersedia setelah pembayaran resmi diaktifkan.</p>
 {loading?<p role="status">Memuat undangan...</p>:error?<div className="dashboard-alert" role="alert"><strong>Data undangan belum bisa dimuat</strong><p>{error}</p><p>Periksa konfigurasi Vercel/Supabase bila masalah berlanjut.</p><button onClick={load}>Coba lagi</button></div>:items.length===0?<div className="dashboard-alert"><h2>Belum ada undangan</h2><p>Pilih salah satu template dan buat undangan pertamamu.</p><Link className="primary" href="/#templates">Jelajahi template ↗</Link></div>:<div className="dashboard-grid">{items.map(it=>{const template=templateById(it.template_id);return <article key={it.id}><span className={'status '+it.status}>{it.status==='published'?'Aktif':'Draft'}</span><small>{template?.name||'Undangan Digital'}</small><h3>{it.data?.couple1||'Nama pertama'} &amp; {it.data?.couple2||'Nama kedua'}</h3><p>Terakhir dibuat: {new Date(it.created_at).toLocaleDateString('id-ID')}</p><Link className="primary" href={'/editor/'+it.id}>Edit &amp; preview</Link>{it.status!=='published'&&<Link href={'/payment/'+it.id}>Pembayaran SeaBank →</Link>}{it.status==='published'&&<Link href={'/invite/'+it.slug} target="_blank">Lihat link aktif ↗</Link>}</article>})}</div>}
 </main>
}
