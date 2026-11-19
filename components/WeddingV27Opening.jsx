/** VIZEX v27: automatic image-derived layers, not admin ornaments. */
import {WEDDING_V26_SLUGS} from '@/lib/wedding-v26';
const LAYERS=['top','bottom','left','right'];
export default function WeddingV27Opening({slug,opening=false}){
 if(!WEDDING_V26_SLUGS.includes(slug))return null;
 return <div className={`v27-opening-scene v27-scene-${slug}${opening?' v27-scene-closing':''}`} aria-hidden="true">
  {LAYERS.map((part,i)=><div className={`v27-piece v27-piece-${part}`} key={part} style={{'--v27-order':i}}>
    <img src={`/themes/v27/${slug}-${part}.webp`} alt="" loading="eager" decoding="async" draggable="false" />
  </div>)}
  <div className="v27-detail v27-detail-a"><img src={`/themes/v27/${slug}-accent-1.webp`} alt="" loading="eager" decoding="async" draggable="false" onError={e=>{e.currentTarget.style.display='none'}} /></div>
  <div className="v27-detail v27-detail-b"><img src={`/themes/v27/${slug}-accent-2.webp`} alt="" loading="eager" decoding="async" draggable="false" onError={e=>{e.currentTarget.style.display='none'}} /></div>
  <div className="v27-light v27-light-one"/><div className="v27-light v27-light-two"/><div className="v27-light v27-light-three"/>
 </div>;
}
