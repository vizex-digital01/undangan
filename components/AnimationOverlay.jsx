'use client';
import {normalizeAnimation} from '@/lib/animation-config';
export default function AnimationOverlay({config,stage='cover'}){
 const a=normalizeAnimation(config),list=a.ornaments.filter(o=>o.scope===stage||o.scope==='all');
 if(!list.length)return null;
 return <div className="v19-ornaments" aria-hidden="true">{list.map(o=><span key={o.id} className={'v19-ornament v19-ornament-'+o.effect} style={{left:o.x+'%',top:o.y+'%',width:o.kind==='image'?o.size+'px':undefined,fontSize:o.size+'px',color:o.color,opacity:o.opacity/100,'--v19-speed':o.speed+'s','--v19-delay':o.delay+'ms'}}>{o.kind==='image'?<img src={o.src} alt="" draggable="false"/>:o.symbol}</span>)}</div>;
}
