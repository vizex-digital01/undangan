'use client';
import {useCallback,useEffect,useRef,useState} from 'react';

const TABS=[
 {id:'opening',label:'Opening',symbol:'✉'},
 {id:'quotes',label:'Doa',symbol:'✧'},
 {id:'couple',label:'Mempelai',symbol:'♥'},
 {id:'event',label:'Acara',symbol:'◷'},
 {id:'gallery',label:'Galeri',symbol:'▧'},
 {id:'rsvp',label:'RSVP',symbol:'✓'},
 {id:'gift',label:'Hadiah',symbol:'♡'}
];
const fmtDate=(value)=>{if(!value)return 'Tanggal acara';const dt=new Date(`${value}T12:00:00`);return Number.isNaN(dt.getTime())?value:new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric'}).format(dt)};
const fmtDay=(value)=>{if(!value)return '';const dt=new Date(`${value}T12:00:00`);return Number.isNaN(dt.getTime())?'':new Intl.DateTimeFormat('id-ID',{weekday:'long'}).format(dt)};
const digits=(s)=>(s||'').replace(/\D/g,'');
const slideClass=(template)=>{const t=template?.theme||'';if(t==='javanese-blue'||t==='mega-mendung'||t==='batik-kawung')return 'blue';if(t==='cream-flowers'||t==='blush'||t==='sakura')return 'cream';if(t==='green-motion'||t==='sage'||t==='emerald')return 'green';return template?.category==='batik'||template?.category==='adat'?'blue':template?.category==='floral'?'cream':template?.category==='cinematic'?'green':'royal';};
function Countdown({date,time}){
 const [remain,setRemain]=useState(null);
 useEffect(()=>{const calc=()=>{const target=new Date(`${date||'2027-06-20'}T${time||'09:00'}:00`).getTime();setRemain(Number.isFinite(target)?Math.max(0,target-Date.now()):null)};calc();const interval=setInterval(calc,1000);return()=>clearInterval(interval)},[date,time]);
 if(remain===null)return null;
 const n=[Math.floor(remain/86400000),Math.floor(remain%86400000/3600000),Math.floor(remain%3600000/60000),Math.floor(remain%60000/1000)];
 return <div className="v15-countdown">{n.map((v,i)=><div key={i}><strong>{String(v).padStart(2,'0')}</strong><span>{['Hari','Jam','Menit','Detik'][i]}</span></div>)}</div>
}
export default function Invitation({data={},template,preview=false,invitationId=null}){
 const [opened,setOpened]=useState(false),[opening,setOpening]=useState(false),[active,setActive]=useState('opening'),[pageCount,setPageCount]=useState(0);
 const [playing,setPlaying]=useState(false),[lightbox,setLightbox]=useState(-1),[copyMessage,setCopyMessage]=useState('');
 const [rsvp,setRsvp]=useState({name:'',attendance:'hadir',partySize:1,wish:''}),[rsvpStatus,setRsvpStatus]=useState(''),[busy,setBusy]=useState(false);
 const audioRef=useRef(null),paneRef=useRef(null),timeoutRef=useRef(null);
 const photos=Array.isArray(data.photos)?data.photos.filter(Boolean):[],cover=photos[0]||null;
 const type=slideClass(template),theme=template?.theme||'ivory';
 const selectedMusic=data.musicTrack||'auto';
 const category=template?.category||'royal';
 const track=selectedMusic==='auto'?(['batik','adat'].includes(category)?'gamelan':category==='cinematic'?'cinematic':'piano'):selectedMusic;
 // The original audio assets in /public/music are part of VIZEX; playback starts only after a user gesture.
 const audioSrc=track==='none'?null:track==='piano'||track==='gamelan'||track==='cinematic'?`/music/${track}.wav`:null;
 const move=useCallback((tab)=>{setActive(tab);setPageCount(c=>c+1);if(paneRef.current)paneRef.current.scrollTop=0},[]);
 const openInvite=()=>{if(opening||opened)return;setOpening(true);if(audioRef.current){audioRef.current.volume=.23;audioRef.current.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false))}timeoutRef.current=setTimeout(()=>{setOpened(true);setOpening(false);setActive('opening')},1150)};
 useEffect(()=>()=>clearTimeout(timeoutRef.current),[]);
 const toggleSound=()=>{const el=audioRef.current;if(!el)return;if(el.paused){el.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false))}else{el.pause();setPlaying(false)}};
 const resetPreview=()=>{clearTimeout(timeoutRef.current);setOpened(false);setOpening(false);setActive('opening');audioRef.current?.pause();setPlaying(false)};
 const copyValue=async(value)=>{if(!value)return;try{await navigator.clipboard.writeText(value);setCopyMessage('Berhasil disalin');setTimeout(()=>setCopyMessage(''),2200)}catch{setCopyMessage('Silakan salin secara manual')}};
 const onRsvp=async(e)=>{e.preventDefault();if(preview||!invitationId){setRsvpStatus('Mode demo: RSVP akan aktif setelah undangan diterbitkan.');return}if(!rsvp.name.trim()){setRsvpStatus('Isi nama terlebih dahulu.');return}setBusy(true);setRsvpStatus('');try{const resp=await fetch('/api/rsvp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...rsvp,invitationId})});const body=await resp.json();if(!resp.ok)throw new Error(body.error||'Tidak bisa menyimpan RSVP');setRsvpStatus(body.message||'Konfirmasi kehadiran berhasil disimpan.')}catch(err){setRsvpStatus(err.message)}finally{setBusy(false)}};
 const contact=digits(data.rsvpPhone);
 return <div className={`v15-shell v15-style-${type} v15-theme-${theme}`}>
 {audioSrc&&<audio ref={audioRef} src={audioSrc} preload="none" loop/>}
 <div className="v15-stage" aria-label="Undangan digital interaktif">
  <div className="v15-paper" aria-hidden="true"/><div className="v15-mist" aria-hidden="true"/><div className="v15-floaters" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></div>
  {!opened?<div className={`v15-entry ${opening?'v15-entry-opening':''}`}>
   <div className="v15-entry-inner"><div className="v15-smallcap">THE WEDDING OF</div><div className="v15-entry-ring"><div className="v15-entry-symbol">{cover?<img src={cover} alt="Foto pengantin"/>:<span>❦</span>}</div></div>
   <h1>{data.couple1||'Raka'} <em>&</em> {data.couple2||'Naira'}</h1><p>{fmtDay(data.date)} · {fmtDate(data.date)}</p><div className="v15-divider">✦</div><p className="v15-to">Kepada Yth.<br/><strong>{data.guest||'Tamu Undangan'}</strong></p><button type="button" className="v15-main-button" disabled={opening} onClick={openInvite}>{opening?'Membuka kisah…':'✉  Buka Undangan'}</button><small>Undangan terbaik untuk momen istimewa</small></div>
   <div className="v15-curtain v15-curtain-left"/><div className="v15-curtain v15-curtain-right"/>
  </div>:<>
   <div className="v15-page-area" ref={paneRef} key={pageCount} role="tabpanel" aria-label={TABS.find(t=>t.id===active)?.label}>
    {active==='opening'&&<div className="v15-panel v15-panel-opening"><span className="v15-kicker">SAVE THE DATE</span><div className="v15-monogram">{(data.couple1||'R').slice(0,1)} <small>&</small> {(data.couple2||'N').slice(0,1)}</div><div className="v15-cover-medallion">{cover?<img src={cover} alt="Foto pengantin"/>:<span>❦</span>}</div><h2>{data.couple1||'Raka'} <em>&</em> {data.couple2||'Naira'}</h2><p className="v15-center-label">{fmtDay(data.date)}, {fmtDate(data.date)}</p><Countdown date={data.date} time={data.time}/><button className="v15-outline-button" onClick={()=>move('quotes')}>Selanjutnya <span aria-hidden="true">→</span></button></div>}
    {active==='quotes'&&<div className="v15-panel v15-panel-quotes"><span className="v15-kicker">DOA & HARAPAN</span><div className="v15-initial-icon">❧</div><h2>Dengan Rahmat<br/>dan Kasih Sayang</h2><p className="v15-quote">“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.”</p><span className="v15-verse">QS. Ar-Rum: 21</span><div className="v15-divider">✦</div><p>{data.quote||'Dua hati, satu kisah, selamanya.'}</p><button className="v15-outline-button" onClick={()=>move('couple')}>Kenali Mempelai →</button></div>}
    {active==='couple'&&<div className="v15-panel v15-panel-couple"><span className="v15-kicker">THE HAPPY COUPLE</span><h2>Dua Hati,<br/>Satu Perjalanan</h2><div className="v15-couple-grid"><article><div className="v15-couple-avatar">{photos[0]?<img src={photos[0]} alt="Foto mempelai pertama"/>:<b>{(data.couple1||'R').charAt(0)}</b>}</div><h3>{data.couple1||'Raka'}</h3><span>MEMPELAI</span></article><span className="v15-amp">&</span><article><div className="v15-couple-avatar">{photos[1]?<img src={photos[1]} alt="Foto mempelai kedua"/>:<b>{(data.couple2||'N').charAt(0)}</b>}</div><h3>{data.couple2||'Naira'}</h3><span>MEMPELAI</span></article></div><p className="v15-story">{data.story||'Setiap perjalanan indah dimulai dengan satu pertemuan.'}</p></div>}
    {active==='event'&&<div className="v15-panel v15-panel-event"><span className="v15-kicker">WEDDING EVENT</span><h2>Hari Bahagia Kami</h2><p>Dengan penuh rasa syukur, kami mengundang Anda untuk hadir.</p><div className="v15-events"><article><span className="v15-event-mark">01</span><h3>Akad Nikah</h3><strong>{fmtDay(data.date)}, {fmtDate(data.date)}</strong><span>{data.time||'09:00'} WIB</span></article><article><span className="v15-event-mark">02</span><h3>Resepsi</h3><strong>{fmtDay(data.date)}, {fmtDate(data.date)}</strong><span>{data.receptionTime||'11:00'} WIB</span></article></div><h3 className="v15-location-title">{data.place||'Lokasi Acara'}</h3><p>{data.address||'Alamat acara'}</p>{data.maps?.startsWith('https://')&&<a href={data.maps} target="_blank" rel="noopener noreferrer" className="v15-main-button">⌖ Buka Google Maps</a>}<div className="v15-spacing"/></div>}
    {active==='gallery'&&<div className="v15-panel v15-panel-gallery"><span className="v15-kicker">OUR MEMORIES</span><h2>Galeri Cerita</h2><p>Momen-momen kecil yang menjadi bagian dari perjalanan kami.</p><div className="v15-photo-grid">{photos.length?photos.map((p,i)=><button type="button" aria-label={`Perbesar foto ${i+1}`} key={i} onClick={()=>setLightbox(i)}><img alt={`Galeri foto ${i+1}`} src={p}/></button>):[0,1,2,3].map(i=><div className="v15-photo-blank" key={i}><span>❦</span><small>FOTO {i+1}</small></div>)}</div>{!photos.length&&<p className="v15-muted">Pemilik undangan bisa menambahkan foto melalui editor VIZEX.</p>}</div>}
    {active==='rsvp'&&<div className="v15-panel v15-panel-rsvp"><span className="v15-kicker">RSVP & WISHES</span><h2>Konfirmasi Kehadiran</h2><p>Mohon berkenan memberi kabar untuk memudahkan persiapan acara kami.</p><form onSubmit={onRsvp} className="v15-rsvp-form"><label>Nama lengkap<input required maxLength="100" value={rsvp.name} onChange={e=>setRsvp(x=>({...x,name:e.target.value}))} placeholder="Nama Anda"/></label><label>Konfirmasi<select value={rsvp.attendance} onChange={e=>setRsvp(x=>({...x,attendance:e.target.value}))}><option value="hadir">InsyaAllah hadir</option><option value="tidak">Maaf, tidak bisa hadir</option><option value="ragu">Belum pasti</option></select></label>{rsvp.attendance==='hadir'&&<label>Jumlah tamu<select value={rsvp.partySize} onChange={e=>setRsvp(x=>({...x,partySize:Number(e.target.value)}))}>{[1,2,3,4].map(n=><option value={n} key={n}>{n} orang</option>)}</select></label>}<label>Ucapan & doa<textarea maxLength={500} rows="3" placeholder="Tulis ucapan untuk kedua mempelai…" value={rsvp.wish} onChange={e=>setRsvp(x=>({...x,wish:e.target.value}))}/></label><button type="submit" disabled={busy} className="v15-main-button">{busy?'Mengirim…':'Kirim Konfirmasi'}</button>{rsvpStatus&&<p className="v15-feedback" role="status">{rsvpStatus}</p>}</form></div>}
    {active==='gift'&&<div className="v15-panel v15-panel-gift"><span className="v15-kicker">WEDDING GIFT</span><div className="v15-initial-icon">♡</div><h2>Tanda Kasih</h2><p>Doa restu Anda merupakan hadiah terindah bagi kami.</p>{data.accountNumber?<div className="v15-bank-card"><small>HADIAH DIGITAL</small><strong>{data.accountName||'Rekening penerima'}</strong><p>{data.accountNumber}</p><button className="v15-outline-button" onClick={()=>copyValue(data.accountNumber)}>Salin Nomor Rekening</button></div>:<p className="v15-muted">Informasi amplop digital belum ditambahkan oleh pemilik undangan.</p>}<div className="v15-divider">✦</div><p>Terima kasih atas doa dan kehadiran Anda.</p><h3>{data.couple1||'Raka'} <em>&</em> {data.couple2||'Naira'}</h3>{copyMessage&&<p role="status">{copyMessage}</p>}</div>}
   </div>
   <div className="v15-side-actions">{audioSrc&&<button type="button" aria-label={playing?'Jeda musik':'Putar musik'} title={playing?'Jeda musik':'Putar musik'} onClick={toggleSound}>{playing?'♫':'♪'}</button>}{contact&&<a href={`https://wa.me/${contact}?text=${encodeURIComponent(`Halo, saya ingin bertanya tentang acara ${data.couple1||''} & ${data.couple2||''}`)}`} aria-label="Hubungi melalui WhatsApp" target="_blank" rel="noopener noreferrer">✆</a>}{!preview&&<button type="button" title="Salin link undangan" aria-label="Salin link undangan" onClick={()=>copyValue(window.location.href)}>↗</button>}</div>
   <nav className="v15-bottom-nav" aria-label="Menu undangan" role="tablist">{TABS.map(item=><button type="button" role="tab" aria-selected={active===item.id} className={active===item.id?'active':''} onClick={()=>move(item.id)} key={item.id}><span aria-hidden="true">{item.symbol}</span><small>{item.label}</small></button>)}</nav>
  </>}
  {preview&&<button className="v15-reset" onClick={resetPreview} title="Ulangi animasi pembuka">↻</button>}
  {lightbox>=0&&<div className="v15-lightbox" role="dialog" aria-modal="true" aria-label="Lihat foto"><button aria-label="Tutup foto" onClick={()=>setLightbox(-1)}>✕</button><img alt="Foto diperbesar" src={photos[lightbox]}/></div>}
 </div></div>
}
