'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {authFetch,supa} from '@/lib/browser';
import {useRouter} from 'next/navigation';
const rupiah=n=>'Rp'+Number(n||0).toLocaleString('id-ID');
const labels={submitted:'Menunggu verifikasi',paid:'Disetujui',rejected:'Ditolak',pending:'Belum upload bukti'};
export default function AdminPayments(){
 const router=useRouter();const [items,setItems]=useState([]),[loaded,setLoaded]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState('');const [filter,setFilter]=useState('submitted'),[search,setSearch]=useState('');
 async function load(){setError('');try{const r=await authFetch('/api/manual/admin');setItems(r.orders||[]);setLoaded(true)}catch(e){setError(e.message)} }
 useEffect(()=>{load()},[]);
 async function logout(){await supa().auth.signOut();router.replace('/login')}
 async function review(order,approve){
  if(approve&&!window.confirm(`Pastikan dana ${rupiah(order.amount)} BENAR-BENAR masuk ke mutasi SeaBank. Setujui pesanan ini?`))return;
  let note='Dana masuk terverifikasi pada mutasi SeaBank';
  if(!approve){const input=window.prompt('Tulis alasan penolakan yang akan ditampilkan ke pelanggan:');if(input===null||!input.trim())return;note=input.trim()}
  setBusy(order.id);setError('');try{await authFetch('/api/manual/review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:order.id,approve,note})});await load()}catch(e){setError(e.message)}finally{setBusy('')}
 }
 const visible=useMemo(()=>items.filter(o=>(filter==='all'||o.status===filter)&&(!search||[o.id,o.invitation_id,o.guest_id].some(x=>String(x||'').toLowerCase().includes(search.toLowerCase())))),[items,filter,search]);
 return <main className="app-page admin-panel admin-payments"><header><Link href="/" className="brand">vizex.</Link><nav className="admin-nav"><Link href="/admin">Ringkasan</Link><Link className="selected" href="/admin/payments">Pembayaran</Link><Link href="/">Website</Link><button type="button" onClick={logout}>Keluar</button></nav></header>
 <span className="eyebrow">VIZEX OWNER ONLY</span><h1>Verifikasi Pembayaran</h1><p className="admin-sub">Cek bukti transfer dan mutasi SeaBank sebelum menyetujui. Hanya admin dengan UID terdaftar yang dapat melakukan tindakan ini.</p>
 <div className="admin-tools"><div className="admin-filter">{[['submitted','Menunggu'],['paid','Disetujui'],['rejected','Ditolak'],['all','Semua']].map(([key,label])=><button type="button" key={key} className={filter===key?'active':''} onClick={()=>setFilter(key)}>{label}</button>)}</div><input aria-label="Cari ID pesanan" placeholder="Cari ID pesanan..." value={search} onChange={e=>setSearch(e.target.value)}/><button type="button" className="outline" onClick={load}>↻ Refresh</button></div>
 {error&&<div className="dashboard-alert" role="alert"><b>Gagal mengambil data.</b><p>{error}</p><Link href="/login">Masuk sebagai admin</Link></div>}
 {!loaded&&!error&&<p>Memuat daftar pembayaran...</p>}
 {loaded&&visible.length===0&&<div className="admin-empty">Tidak ada pesanan untuk filter ini.</div>}
 <div className="admin-orders">{visible.map(o=><article className="payment-card admin-order" key={o.id}>
 <div className="admin-order-top"><span className={'admin-status status-'+o.status}>{labels[o.status]||o.status}</span><strong>{rupiah(o.amount)}</strong></div>
 <small>ID Pesanan</small><code>{o.id}</code><small>ID Undangan</small><code>{o.invitation_id||'—'}</code>
 <p>Jenis pelanggan: {o.guest_id?'Tanpa akun':'Akun lama'}</p><p>Bukti dikirim: {o.submitted_at?new Date(o.submitted_at).toLocaleString('id-ID'):'Belum ada bukti'}</p>
 {o.admin_note&&<p>Catatan admin: {o.admin_note}</p>}
 {o.proofUrl?<a className="admin-proof" href={o.proofUrl} target="_blank" rel="noopener noreferrer">Lihat bukti transfer ↗ (tautan sementara)</a>:<span className="hint">Bukti transfer belum tersedia.</span>}
 {o.status==='submitted'&&<div className="admin-actions"><button type="button" className="primary" disabled={!!busy} onClick={()=>review(o,true)}>{busy===o.id?'Memproses…':'Setujui setelah cek mutasi'}</button><button type="button" className="outline" disabled={!!busy} onClick={()=>review(o,false)}>Tolak bukti</button></div>}
 </article>)}</div><p className="hint">Jangan setujui pesanan uji atau bukti screenshot saja tanpa memastikan transaksi benar-benar diterima.</p>
 </main>
}
