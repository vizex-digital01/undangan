'use client';
import {useCallback,useEffect,useState} from 'react';
import {guestFetch} from '@/lib/guest-browser';
import Link from 'next/link';
import {templateById} from '@/lib/catalog';
export default function Dashboard(){
 const [items,setItems]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 const load=useCallback(async()=>{setLoading(true);setError('');try{const r=await guestFetch('/api/drafts');setItems(r.items||[])}catch(e){setError(e.message)}finally{setLoading(false)}},[]);
 useEffect(()=>{load()},[load]);
 return <main className="app-page"><header><Link href="/" className="brand">vizex.</Link><Link href="/#templates">+ Buat baru</Link></header><span className="eyebrow">UNDANGAN SAYA</span><h1>Draft Undangan</h1><p>Tidak perlu daftar akun. Undangan tersimpan di browser ini selama sesi masih aktif. Jangan hapus cookie sebelum pesanan selesai.</p>
 {loading?<p>Memuat undangan...</p>:error?<div className="dashboard-alert"><strong>Gagal memuat draft</strong><p>{error}</p><button onClick={load}>Coba lagi</button></div>:items.length===0?<div className="dashboard-alert"><h2>Belum ada undangan</h2><p>Silakan pilih salah satu template untuk membuat undangan pertamamu.</p><Link className="primary" href="/#templates">Pilih Template ↗</Link></div>:<div className="dashboard-grid">{items.map(it=>{const t=templateById(it.template_id);return <article key={it.id}><span className={'status '+it.status}>{it.status==='published'?'Aktif':'Draft'}</span><small>{t?.name||'Undangan Digital'}</small><h3>{it.data?.couple1||'Nama pertama'} &amp; {it.data?.couple2||'Nama kedua'}</h3><Link className="primary" href={'/editor/'+it.id}>Edit &amp; preview</Link><Link href={'/rsvp/manage/'+it.id}>Lihat daftar hadir / RSVP →</Link>{it.status!=='published'&&<Link href={'/payment/'+it.id}>Bayar via SeaBank →</Link>}{it.status==='published'&&<Link href={'/invite/'+it.slug} target="_blank">Lihat link aktif ↗</Link>}</article>})}</div>}
 </main>
}
