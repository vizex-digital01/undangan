'use client';
import {useEffect,useState} from 'react';import Link from 'next/link';import {guestFetch} from '@/lib/guest-browser';
const rupiah=n=>'Rp'+Number(n||0).toLocaleString('id-ID');
export default function Payment({params}){
 const [id,setId]=useState(''),[order,setOrder]=useState(null),[status,setStatus]=useState(null),[file,setFile]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState('');
 useEffect(()=>{Promise.resolve(params).then(p=>setId(p.id))},[params]);
 async function updateStatus(v=id){if(!v)return;try{const x=await guestFetch('/api/manual/status?invitationId='+encodeURIComponent(v));setStatus(x)}catch(e){setError(e.message)}}
 async function checkout(){setBusy(true);setError('');try{const r=await guestFetch('/api/manual/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});setOrder(r);await updateStatus();}catch(e){setError(e.message)}finally{setBusy(false)}}
 async function send(e){e.preventDefault();if(!file||!order)return;setBusy(true);setError('');try{const f=new FormData();f.append('orderId',order.orderId);f.append('file',file);await guestFetch('/api/manual/proof',{method:'POST',body:f});setFile(null);setMessage('Bukti dikirim. Admin akan mencocokkan dengan mutasi SeaBank sebelum mengaktifkan undangan.');await updateStatus();setOrder(o=>({...o,status:'submitted'}));}catch(e){setError(e.message)}finally{setBusy(false)}}
 useEffect(()=>{if(id)updateStatus(id)},[id]);const published=status?.invitation?.status==='published';const current=status?.orders?.[0];
 return <main className="app-page payment-page"><header><Link className="brand" href="/">vizex.</Link><Link href="/dashboard">← Dashboard</Link></header><span className="eyebrow">CHECKOUT VIZEX</span><h1>Pembayaran SeaBank</h1><p>Transfer manual, diverifikasi admin. Tanpa akun pelanggan. Link publik aktif setelah admin memeriksa pembayaran.</p>
 {error&&<p className="payment-error" role="alert">{error}</p>}{message&&<p role="status">{message}</p>}
 {published?<div className="payment-card"><h2>Undangan sudah aktif ✓</h2><Link className="primary" href={'/invite/'+status.invitation.slug}>Buka undangan ↗</Link><p><Link href={'/rsvp/manage/'+id}>Lihat daftar kehadiran tamu →</Link></p></div>:<div className="payment-card">
 {current?.status==='submitted'?<><h2>Menunggu verifikasi admin</h2><p>Bukti transfer sudah terkirim. Jangan melakukan pembayaran kedua. Silakan cek kembali status secara berkala.</p></>:current?.status==='rejected'?<><h2>Bukti belum dapat disetujui</h2><p>{current.admin_note||'Hubungi admin untuk meminta pemeriksaan ulang.'}</p><p>Kalau perlu, lo bisa membuat permintaan pembayaran baru.</p></>:<><h2>Aktifkan undangan</h2><p>Buat tagihan dari server untuk template yang sudah lo pilih.</p></>}
 {order&&current?.status!=='submitted'&&<div className="bank-box"><span>Transfer ke rekening</span><h3>{order.bankName}</h3><p>Atas nama: <strong>{order.accountName}</strong></p><p>Nomor rekening: <strong>{order.accountNumber}</strong></p><p>Total tagihan: <strong>{rupiah(order.amount)}</strong></p><small>Transfer sesuai nominal. Jangan transfer sebelum rekening dan nama penerima cocok di aplikasi bank.</small></div>}
 {(!current||['pending','rejected','failed'].includes(current.status))&&(!order||current?.status==='rejected')&&<button className="primary" disabled={busy||!id} onClick={checkout}>{busy?'Memproses...':current?.status==='rejected'?'Buat tagihan ulang':'Lihat rekening & nominal'}</button>}
 {order?.status==='pending'&&current?.status!=='submitted'&&<form className="proof-form" onSubmit={send}><label>Upload bukti transfer (JPG, PNG, WEBP, PDF; maksimal 4 MB)<input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required onChange={e=>setFile(e.target.files?.[0]||null)}/></label><button className="primary" disabled={busy||!file} type="submit">{busy?'Mengirim...':'Kirim bukti pembayaran'}</button></form>}
 <button className="outline" type="button" disabled={busy} onClick={()=>updateStatus()}>Perbarui status pembayaran</button>
 </div>}
 </main>
}
