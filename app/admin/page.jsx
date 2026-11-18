'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {authFetch,supa} from '@/lib/browser';
import {useRouter} from 'next/navigation';
const money=x=>'Rp'+Number(x||0).toLocaleString('id-ID');
export default function AdminHome(){
 const [orders,setOrders]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const router=useRouter();
 async function refresh(){setLoading(true);setError('');try{const r=await authFetch('/api/manual/admin');setOrders(r.orders||[])}catch(e){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{refresh()},[]);
 async function logout(){await supa().auth.signOut();router.replace('/login')}
 const waiting=orders.filter(x=>x.status==='submitted'),paid=orders.filter(x=>x.status==='paid'),rejected=orders.filter(x=>x.status==='rejected');
 const revenue=paid.reduce((n,x)=>n+Number(x.amount||0),0);
 return <main className="app-page admin-panel">
 <header><Link href="/" className="brand">vizex.</Link><nav className="admin-nav"><Link className="selected" href="/admin">Ringkasan</Link><Link href="/admin/payments">Verifikasi Pembayaran</Link><Link href="/">Lihat Website</Link><button type="button" onClick={logout}>Keluar</button></nav></header>
 <span className="eyebrow">OWNER CONTROL CENTER</span><h1>Dashboard Admin</h1><p className="admin-sub">Kelola pesanan undangan VIZEX dan verifikasi transfer SeaBank. Pelanggan tidak perlu membuat akun.</p>
 {error?<div className="dashboard-alert"><h2>Akses admin / data belum tersedia</h2><p>{error}</p><p>Pastikan login memakai UID yang terdaftar di <code>VIZEX_ADMIN_USER_IDS</code>.</p><Link className="primary" href="/login">Login Admin →</Link></div>:<>
 <div className="admin-summary">
  <article><span>Menunggu verifikasi</span><strong>{loading?'—':waiting.length}</strong><small>Bukti transfer perlu diperiksa</small></article>
  <article><span>Total pesanan</span><strong>{loading?'—':orders.length}</strong><small>Semua status pembayaran</small></article>
  <article><span>Sudah disetujui</span><strong>{loading?'—':paid.length}</strong><small>Link undangan dapat aktif</small></article>
  <article><span>Total pembayaran disetujui</span><strong className="admin-revenue">{loading?'—':money(revenue)}</strong><small>Bukan saldo bank real-time</small></article>
 </div>
 <section className="admin-feature"><div><span className="eyebrow">PAYMENT REVIEW</span><h2>Pembayaran SeaBank</h2><p>{loading?'Memuat transaksi…':waiting.length?`${waiting.length} pesanan menunggu pemeriksaan mutasi SeaBank.`:'Tidak ada pembayaran yang menunggu verifikasi.'}</p><p className="hint">Bukti transfer bukan jaminan dana diterima. Selalu cocokkan di aplikasi SeaBank.</p></div><Link className="primary" href="/admin/payments">Buka daftar pembayaran →</Link></section>
 <div className="admin-quick"><Link href="/admin/payments">↗ Semua pesanan & bukti transfer</Link><Link href="/">↗ Lihat katalog undangan</Link><button type="button" onClick={refresh}>↻ {loading?'Memuat…':'Refresh ringkasan'}</button></div>
 <p className="hint">Ditolak: {rejected.length} · Belum upload bukti: {orders.filter(x=>x.status!=='submitted'&&x.status!=='paid'&&x.status!=='rejected').length}. Ringkasan hanya menampilkan data dari API admin.</p>
 </>}
 </main>;
}
