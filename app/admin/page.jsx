'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {authFetch,supa} from '@/lib/browser';
import {useRouter} from 'next/navigation';
export default function AdminHome(){
 const [stats,setStats]=useState(null),[error,setError]=useState('');const router=useRouter();
 useEffect(()=>{authFetch('/api/manual/admin').then(r=>{const orders=r.orders||[];setStats({total:orders.length,waiting:orders.filter(o=>o.status==='submitted').length,paid:orders.filter(o=>o.status==='paid').length})}).catch(e=>setError(e.message));},[]);
 return <main className="app-page"><header><Link href="/" className="brand">vizex.</Link><nav className="admin-nav"><Link href="/admin/payments">Pembayaran</Link><Link href="/">Lihat Website</Link><button onClick={async()=>{await supa().auth.signOut();router.replace('/login')}}>Keluar</button></nav></header>
 <span className="eyebrow">KHUSUS PEMILIK STUDIO</span><h1>Admin VIZEX</h1><p>Kelola pembayaran dan penerbitan undangan pelanggan tanpa mengharuskan mereka membuat akun.</p>
 {error?<div className="dashboard-alert"><h2>Login admin diperlukan</h2><p>{error}</p><Link className="primary" href="/login">Masuk sebagai admin →</Link></div>:stats?<div className="dashboard-grid"><article><small>Menunggu diperiksa</small><h3>{stats.waiting} pembayaran</h3><p>Cek mutasi SeaBank sebelum menyetujui transfer.</p><Link className="primary" href="/admin/payments">Verifikasi Pembayaran →</Link></article><article><small>Pesanan terbaru</small><h3>{stats.total} pesanan</h3><p>{stats.paid} pembayaran telah disetujui.</p><Link href="/admin/payments">Lihat Semua Pesanan →</Link></article></div>:<p>Memuat dashboard admin...</p>}
 </main>;
}
