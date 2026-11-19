'use client';
import {visualForTemplate,layoutForTemplate,visualThemes} from '@/lib/theme-artwork';
import {premiumArtSlug} from '@/lib/premium-v24';
import {weddingArtSlug} from '@/lib/wedding-v25';
import {weddingV26Slug} from '@/lib/wedding-v26';
import WeddingV26Layers from '@/components/WeddingV26Layers';
import WeddingOpeningLayers from '@/components/WeddingOpeningLayers';
import {useCallback,useEffect,useRef,useState} from 'react';
import {resolveMusic} from '@/lib/music';
import {animationForTemplate} from '@/lib/animation-config';
import AnimationOverlay from '@/components/AnimationOverlay';
import EventInvitation from '@/components/EventInvitation';

const SECTIONS=[
 {id:'opening',label:'Awal',symbol:'✉'},
 {id:'quotes',label:'Doa',symbol:'✧'},
 {id:'couple',label:'Mempelai',symbol:'♥'},
 {id:'event',label:'Acara',symbol:'◷'},
 {id:'gallery',label:'Galeri',symbol:'▧'},
 {id:'rsvp',label:'RSVP',symbol:'✓'},
 {id:'gift',label:'Hadiah',symbol:'♡'}
];
const dateString=(value)=>{
 if(!value)return 'Tanggal acara';
 const d=new Date(`${value}T12:00:00`);
 return Number.isNaN(d.getTime())?value:new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric'}).format(d);
};
const dayString=(value)=>{
 if(!value)return '';
 const d=new Date(`${value}T12:00:00`);
 return Number.isNaN(d.getTime())?'':new Intl.DateTimeFormat('id-ID',{weekday:'long'}).format(d);
};
const digits=(s)=>(s||'').replace(/\D/g,'');
function themeClass(template){
 const t=template?.theme||'';
 if(['javanese-blue','mega-mendung','batik-kawung'].includes(t))return 'blue';
 if(['cream-flowers','blush','sakura'].includes(t))return 'cream';
 if(['green-motion','sage','emerald'].includes(t))return 'green';
 return ['batik','adat'].includes(template?.category)?'blue':template?.category==='floral'?'cream':template?.category==='cinematic'?'green':'royal';
}
function Countdown({date,time}){
 const [remain,setRemain]=useState(null);
 useEffect(()=>{
  const calc=()=>{
   const value=new Date(`${date||'2027-06-20'}T${time||'09:00'}:00`).getTime();
   setRemain(Number.isFinite(value)?Math.max(0,value-Date.now()):null);
  };
  calc();const timer=setInterval(calc,1000);return()=>clearInterval(timer);
 },[date,time]);
 if(remain===null)return null;
 const n=[Math.floor(remain/86400000),Math.floor(remain%86400000/3600000),Math.floor(remain%3600000/60000),Math.floor(remain%60000/1000)];
 return <div className="v15-countdown">{n.map((v,i)=><div key={i}><strong>{String(v).padStart(2,'0')}</strong><span>{['Hari','Jam','Menit','Detik'][i]}</span></div>)}</div>;
}

function WeddingInvitation({data={},template,preview=false,invitationId=null}){
 const [opened,setOpened]=useState(false);
 const [opening,setOpening]=useState(false);
 const [active,setActive]=useState('opening');
 const [progress,setProgress]=useState(0);
 const [playing,setPlaying]=useState(false);
 const [lightbox,setLightbox]=useState(-1);
 const [copyMessage,setCopyMessage]=useState('');
 const [rsvp,setRsvp]=useState({name:'',attendance:'hadir',partySize:1,wish:''});
 const [rsvpStatus,setRsvpStatus]=useState('');
 const [busy,setBusy]=useState(false);
 const audioRef=useRef(null);
 const scrollRef=useRef(null);
 const animationRef=useRef(null);
 const photos=Array.isArray(data.photos)?data.photos.filter(Boolean):[];
 const cover=photos[0]||null;
 const music=resolveMusic(data.musicTrack||'auto',template);
 const anim=animationForTemplate(template);
 const weddingSlug=weddingArtSlug(template);
 const v26Slug=weddingV26Slug(template);
 const type=themeClass(template);
 const theme=template?.theme||'ivory';
 const contact=digits(data.rsvpPhone);

 // One long scroll container. The lower navigation only scrolls to the target section.
 const scrollToSection=useCallback((id)=>{
  const pane=scrollRef.current;
  const section=pane?.querySelector(`[data-section="${id}"]`);
  if(!pane||!section)return;
  setActive(id);
  pane.scrollTo({top:section.offsetTop-pane.offsetTop,behavior:'smooth'});
 },[]);

 useEffect(()=>{
  if(!opened||!scrollRef.current)return;
  const pane=scrollRef.current;
  const reveals=[...pane.querySelectorAll('.v16-reveal')];
  // Stagger each visible section independently, so each new scroll area comes alive.
  pane.querySelectorAll('.v16-section').forEach(section=>{
   section.querySelectorAll('.v16-reveal').forEach((el,index)=>{
    el.style.setProperty('--v17-order',Math.min(index,7));
   });
  });
  let observer;
  if(typeof IntersectionObserver!=='undefined'){
   observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
     if(entry.isIntersecting){entry.target.classList.add('v16-visible');observer.unobserve(entry.target);}
    });
   },{root:pane,threshold:0.13,rootMargin:'0px 0px 9% 0px'});
   reveals.forEach(el=>observer.observe(el));
  }else reveals.forEach(el=>el.classList.add('v16-visible'));
  let frame=0;
  const checkScroll=()=>{
   if(frame)return;
   frame=requestAnimationFrame(()=>{
    frame=0;
    const max=pane.scrollHeight-pane.clientHeight;
    const ratio=max>0?pane.scrollTop/max:0;
    setProgress(Math.min(1,Math.max(0,ratio)));
    const sections=[...pane.querySelectorAll('[data-section]')];
    const marker=pane.scrollTop+pane.clientHeight*.4;
    let current=sections[0];
    sections.forEach(section=>{if(section.offsetTop-pane.offsetTop<=marker)current=section});
    if(current)setActive(current.dataset.section);
    pane.parentElement?.style.setProperty('--scroll-shift',`${Math.round(ratio*48)}px`);
    pane.parentElement?.style.setProperty('--v17-scroll',ratio.toFixed(3));
   });
  };
  pane.addEventListener('scroll',checkScroll,{passive:true});
  checkScroll();
  return()=>{observer?.disconnect();pane.removeEventListener('scroll',checkScroll);if(frame)cancelAnimationFrame(frame)};
 },[opened]);

 useEffect(()=>{
  const audio=audioRef.current;
  setPlaying(false);
  if(!audio)return;
  const handleEnded=()=>setPlaying(false);
  const handlePause=()=>setPlaying(false);
  audio.addEventListener('ended',handleEnded);
  audio.addEventListener('pause',handlePause);
  return()=>{audio.removeEventListener('ended',handleEnded);audio.removeEventListener('pause',handlePause)};
 },[music?.file]);
 useEffect(()=>()=>{clearTimeout(animationRef.current);if(audioRef.current)audioRef.current.pause()},[]);

 useEffect(()=>{if(!opened||!scrollRef.current)return;scrollRef.current.querySelectorAll('.v16-section').forEach(section=>{section.dataset.v19Effect=anim.sections?.[section.dataset.section]||anim.scroll.effect;});},[opened,template?.animationConfig]);
 const openInvitation=()=>{
  if(opened||opening)return;
  setOpening(true);
  // This click is a user gesture: browsers normally permit starting music here.
  const audio=audioRef.current;
  if(audio){audio.volume=.23;audio.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false));}
  animationRef.current=setTimeout(()=>{setOpened(true);setOpening(false)},anim.cover.duration);
 };
 const toggleMusic=()=>{
  const audio=audioRef.current;if(!audio)return;
  if(audio.paused){audio.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false));}
  else {audio.pause();setPlaying(false)}
 };
 const reset=()=>{
  clearTimeout(animationRef.current);setOpened(false);setOpening(false);setProgress(0);setActive('opening');
  if(audioRef.current){audioRef.current.pause();audioRef.current.currentTime=0;}setPlaying(false);
 };
 const copyValue=async(value)=>{
  if(!value)return;
  try{await navigator.clipboard.writeText(value);setCopyMessage('Berhasil disalin')}
  catch{setCopyMessage('Silakan salin secara manual')}
  setTimeout(()=>setCopyMessage(''),2200);
 };
 const sendRsvp=async(e)=>{
  e.preventDefault();
  if(preview||!invitationId){setRsvpStatus('Mode preview: RSVP aktif setelah undangan diterbitkan.');return}
  if(!rsvp.name.trim()){setRsvpStatus('Isi nama terlebih dahulu.');return}
  setBusy(true);setRsvpStatus('');
  try{
   const resp=await fetch('/api/rsvp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...rsvp,invitationId})});
   const body=await resp.json();
   if(!resp.ok)throw new Error(body.error||'Tidak bisa menyimpan RSVP');
   setRsvpStatus(body.message||'Konfirmasi kehadiran berhasil disimpan.');
  }catch(error){setRsvpStatus(error.message)}finally{setBusy(false)}
 };
 return <div className={`v15-shell v16-shell v17-shell v19-shell v15-style-${type} v15-theme-${theme} v22-v-${visualForTemplate(template)} v23-v-${visualForTemplate(template)} v23-l-${layoutForTemplate(template)} ${premiumArtSlug(template)?`v24-premium v24-art-${premiumArtSlug(template)}`:''} ${weddingSlug||v26Slug?`v24-premium v25-premium v25-art-${weddingSlug||v26Slug} ${opened?'v25-is-open':''}`:''}`} data-visual={type} data-v19-cover={anim.cover.effect} data-v19-effect={anim.scroll.effect} style={{'--v19-cover-duration':anim.cover.duration+'ms','--v19-scroll-duration':anim.scroll.duration+'ms','--v19-stagger':anim.scroll.stagger+'ms'}}>
  {music&&<audio ref={audioRef} key={music.file} src={music.file} preload="none" loop playsInline/>}
  <div className="v15-stage" aria-label="Undangan digital VIZEX">
   <AnimationOverlay config={anim} stage={opened?'content':'cover'}/>
   <div className="v15-paper" aria-hidden="true"/>
   <div className="v15-mist" aria-hidden="true"/>
   <div className="v15-floaters" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></div>
   <div className="v17-corner-frame" aria-hidden="true"><span className="v17-corner v17-tl">❦</span><span className="v17-corner v17-tr">❧</span><span className="v17-corner v17-bl">❧</span><span className="v17-corner v17-br">❦</span></div>
   <div className="v17-ambient" aria-hidden="true"><span/><span/><span/><span/><span/><span/><span/><span/></div>
   {!opened?<div className={`v15-entry ${opening?'v15-entry-opening':''}`}>
    <WeddingOpeningLayers slug={weddingSlug}/>
    <WeddingV26Layers slug={v26Slug}/>
    <div className="v15-entry-inner">
     <div className="v15-smallcap">THE WEDDING OF</div>
     <div className="v15-entry-ring"><div className="v15-entry-symbol">{cover?<img src={cover} alt="Foto pengantin"/>:<span>❦</span>}</div></div>
     <h1>{data.couple1||'Raka'} <em>&amp;</em> {data.couple2||'Naira'}</h1>
     <p>{dayString(data.date)} · {dateString(data.date)}</p><div className="v15-divider">✦</div>
     <p className="v15-to">Kepada Yth.<br/><strong>{data.guest||'Tamu Undangan'}</strong></p>
     <button type="button" className="v15-main-button" onClick={openInvitation} disabled={opening}>{opening?'Membuka undangan…':'✉ Buka Undangan'}</button>
     <small className="v17-open-hint">Musik & animasi dimulai setelah undangan dibuka</small>
    </div>
    <div className="v15-curtain v15-curtain-left"/><div className="v15-curtain v15-curtain-right"/>
   </div>:<>
    <div className="v16-progress" aria-hidden="true"><span style={{width:`${progress*100}%`}}/></div>
    <div className="v17-section-counter" aria-hidden="true"><span>{String(Math.max(1,SECTIONS.findIndex(item=>item.id===active)+1)).padStart(2,'0')}</span><i/>07</div>
    <main className="v15-page-area v16-scroll-area" ref={scrollRef} aria-label="Isi undangan yang bisa discroll">
     <section data-section="opening" id="v16-opening" className="v15-panel v15-panel-opening v16-section">
      <span className="v15-kicker v16-reveal">SAVE THE DATE</span>
      <div className="v15-monogram v16-reveal">{(data.couple1||'R').slice(0,1)} <small>&amp;</small> {(data.couple2||'N').slice(0,1)}</div>
      <div className="v15-cover-medallion v16-reveal v16-zoom">{cover?<img src={cover} alt="Foto kedua mempelai"/>:<span>❦</span>}</div>
      <h2 className="v16-reveal">{data.couple1||'Raka'} <em>&amp;</em> {data.couple2||'Naira'}</h2>
      <p className="v15-center-label v16-reveal">{dayString(data.date)}, {dateString(data.date)}</p>
      <div className="v16-reveal"><Countdown date={data.date} time={data.time}/></div>
      <button type="button" className="v15-outline-button v16-reveal v17-scroll-prompt" onClick={()=>scrollToSection('quotes')}>Geser untuk lanjut <span aria-hidden="true">↓</span></button>
     </section>
     <section data-section="quotes" id="v16-quotes" className="v15-panel v15-panel-quotes v16-section">
      <span className="v15-kicker v16-reveal">DOA &amp; HARAPAN</span>
      <div className="v15-initial-icon v16-reveal v16-zoom">❧</div>
      <h2 className="v16-reveal">Dengan Rahmat<br/>dan Kasih Sayang</h2>
      <p className="v15-quote v16-reveal">“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.”</p>
      <span className="v15-verse v16-reveal">QS. Ar-Rum: 21 (kutipan terjemahan)</span>
      <div className="v15-divider v16-reveal">✦</div>
      <p className="v16-reveal">{data.quote||'Dua hati, satu kisah, selamanya.'}</p>
     </section>
     <section data-section="couple" id="v16-couple" className="v15-panel v15-panel-couple v16-section">
      <span className="v15-kicker v16-reveal">THE HAPPY COUPLE</span>
      <h2 className="v16-reveal">Dua Hati,<br/>Satu Perjalanan</h2>
      <div className="v15-couple-grid">
       <article className="v16-reveal v16-left"><div className="v15-couple-avatar">{photos[0]?<img src={photos[0]} alt="Foto mempelai pertama"/>:<b>{(data.couple1||'R').charAt(0)}</b>}</div><h3>{data.couple1||'Raka'}</h3><span>MEMPELAI</span></article>
       <span className="v15-amp v16-reveal">&amp;</span>
       <article className="v16-reveal v16-right"><div className="v15-couple-avatar">{photos[1]?<img src={photos[1]} alt="Foto mempelai kedua"/>:<b>{(data.couple2||'N').charAt(0)}</b>}</div><h3>{data.couple2||'Naira'}</h3><span>MEMPELAI</span></article>
      </div>
      <p className="v15-story v16-reveal">{data.story||'Setiap perjalanan indah dimulai dengan satu pertemuan.'}</p>
     </section>
     <section data-section="event" id="v16-event" className="v15-panel v15-panel-event v16-section">
      <span className="v15-kicker v16-reveal">WEDDING EVENT</span>
      <h2 className="v16-reveal">Hari Bahagia Kami</h2>
      <p className="v16-reveal">Dengan penuh rasa syukur, kami mengundang Anda untuk hadir.</p>
      <div className="v15-events"><article className="v16-reveal v16-left"><span className="v15-event-mark">01</span><h3>Akad Nikah</h3><strong>{dayString(data.date)}, {dateString(data.date)}</strong><span>{data.time||'09:00'} WIB</span></article><article className="v16-reveal v16-right"><span className="v15-event-mark">02</span><h3>Resepsi</h3><strong>{dayString(data.date)}, {dateString(data.date)}</strong><span>{data.receptionTime||'11:00'} WIB</span></article></div>
      <h3 className="v15-location-title v16-reveal">{data.place||'Lokasi Acara'}</h3><p className="v16-reveal">{data.address||'Alamat acara'}</p>
      {data.maps?.startsWith('https://')&&<a href={data.maps} target="_blank" rel="noopener noreferrer" className="v15-main-button v16-reveal">⌖ Buka Google Maps</a>}
     </section>
     <section data-section="gallery" id="v16-gallery" className="v15-panel v15-panel-gallery v16-section">
      <span className="v15-kicker v16-reveal">OUR MEMORIES</span><h2 className="v16-reveal">Galeri Cerita</h2>
      <p className="v16-reveal">Momen-momen kecil yang menjadi bagian dari perjalanan kami.</p>
      <div className="v15-photo-grid">{photos.length?photos.map((photo,i)=><button key={i} className="v16-reveal v16-zoom" type="button" aria-label={`Perbesar foto ${i+1}`} onClick={()=>setLightbox(i)}><img alt={`Galeri foto ${i+1}`} src={photo} loading="lazy"/></button>):[0,1,2,3].map(i=><div className="v15-photo-blank v16-reveal v16-zoom" key={i}><span>❦</span><small>FOTO {i+1}</small></div>)}</div>
      {!photos.length&&<p className="v15-muted v16-reveal">Pemilik undangan dapat menambahkan foto di editor VIZEX.</p>}
     </section>
     <section data-section="rsvp" id="v16-rsvp" className="v15-panel v15-panel-rsvp v16-section">
      <span className="v15-kicker v16-reveal">RSVP &amp; WISHES</span><h2 className="v16-reveal">Konfirmasi Kehadiran</h2>
      <p className="v16-reveal">Mohon berkenan memberi kabar untuk memudahkan persiapan acara kami.</p>
      <form onSubmit={sendRsvp} className="v15-rsvp-form v16-reveal">
       <label>Nama lengkap<input required maxLength="100" value={rsvp.name} onChange={e=>setRsvp(v=>({...v,name:e.target.value}))} placeholder="Nama Anda"/></label>
       <label>Konfirmasi<select value={rsvp.attendance} onChange={e=>setRsvp(v=>({...v,attendance:e.target.value}))}><option value="hadir">InsyaAllah hadir</option><option value="tidak">Maaf, tidak bisa hadir</option><option value="ragu">Belum pasti</option></select></label>
       {rsvp.attendance==='hadir'&&<label>Jumlah tamu<select value={rsvp.partySize} onChange={e=>setRsvp(v=>({...v,partySize:Number(e.target.value)}))}>{[1,2,3,4].map(n=><option value={n} key={n}>{n} orang</option>)}</select></label>}
       <label>Ucapan &amp; doa<textarea maxLength={500} rows={3} placeholder="Tulis ucapan untuk kedua mempelai…" value={rsvp.wish} onChange={e=>setRsvp(v=>({...v,wish:e.target.value}))}/></label>
       <button type="submit" disabled={busy} className="v15-main-button">{busy?'Mengirim…':'Kirim Konfirmasi'}</button>
       {rsvpStatus&&<p className="v15-feedback" role="status">{rsvpStatus}</p>}
      </form>
     </section>
     <section data-section="gift" id="v16-gift" className="v15-panel v15-panel-gift v16-section">
      <span className="v15-kicker v16-reveal">WEDDING GIFT</span><div className="v15-initial-icon v16-reveal v16-zoom">♡</div><h2 className="v16-reveal">Tanda Kasih</h2>
      <p className="v16-reveal">Doa restu Anda merupakan hadiah terindah bagi kami.</p>
      {data.accountNumber?<div className="v15-bank-card v16-reveal"><small>HADIAH DIGITAL</small><strong>{data.accountName||'Rekening penerima'}</strong><p>{data.accountNumber}</p><button className="v15-outline-button" onClick={()=>copyValue(data.accountNumber)}>Salin Nomor Rekening</button></div>:<p className="v15-muted v16-reveal">Informasi amplop digital belum ditambahkan oleh pemilik undangan.</p>}
      <div className="v15-divider v16-reveal">✦</div><p className="v16-reveal">Terima kasih atas doa dan kehadiran Anda.</p><h3 className="v16-reveal">{data.couple1||'Raka'} <em>&amp;</em> {data.couple2||'Naira'}</h3>
      {copyMessage&&<p role="status">{copyMessage}</p>}
     </section>
     <div className="v16-ending" aria-hidden="true">❦</div>
    </main>
    <div className="v15-side-actions">
     {music&&<button type="button" onClick={toggleMusic} aria-label={playing?'Jeda musik':'Putar musik'} title={playing?`Jeda: ${music.label}`:`Putar: ${music.label}`}>{playing?'♫':'♪'}</button>}
     {contact&&<a href={`https://wa.me/${contact}?text=${encodeURIComponent(`Halo, saya ingin bertanya tentang acara ${data.couple1||''} & ${data.couple2||''}`)}`} aria-label="Hubungi melalui WhatsApp" target="_blank" rel="noopener noreferrer">✆</a>}
     {!preview&&<button type="button" onClick={()=>copyValue(window.location.href)} aria-label="Salin link undangan">↗</button>}
    </div>
    <nav className="v15-bottom-nav" aria-label="Lompat ke bagian undangan">{SECTIONS.map(item=><button type="button" key={item.id} className={active===item.id?'active':''} aria-current={active===item.id?'location':undefined} onClick={()=>scrollToSection(item.id)}><span aria-hidden="true">{item.symbol}</span><small>{item.label}</small></button>)}</nav>
   </>}
   {preview&&<button className="v15-reset" onClick={reset} type="button" title="Ulangi pembuka">↻</button>}
   {lightbox>=0&&<div className="v15-lightbox" role="dialog" aria-modal="true" aria-label="Lihat foto"><button type="button" aria-label="Tutup foto" onClick={()=>setLightbox(-1)}>✕</button><img alt="Foto diperbesar" src={photos[lightbox]}/></div>}
  </div>
 </div>;
}

export default function Invitation(props){
 return props.template?.eventType&&props.template.eventType!=='wedding'?<EventInvitation {...props}/>:<WeddingInvitation {...props}/>;
}
