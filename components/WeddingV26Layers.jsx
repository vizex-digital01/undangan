/** Decorative layers: non-clickable, intentionally kept outside main text safe zone. */
import {WEDDING_V26_SLUGS} from '@/lib/wedding-v26';
export default function WeddingV26Layers({slug}){
 if(!WEDDING_V26_SLUGS.includes(slug))return null;
 return <div className={`v26-motion-layer v26-motion-${slug}`} aria-hidden="true">
  <img className="v26-ornament v26-ornament-left" src={`/themes/v26/${slug}-ornament.svg`} alt=""/>
  <img className="v26-ornament v26-ornament-right" src={`/themes/v26/${slug}-ornament.svg`} alt=""/>
  <img className="v26-ornament v26-ornament-arch" src={`/themes/v26/${slug}-arch.svg`} alt=""/>
  <img className="v26-ornament v26-ornament-spark-one" src={`/themes/v26/${slug}-star.svg`} alt=""/>
  <img className="v26-ornament v26-ornament-spark-two" src={`/themes/v26/${slug}-star.svg`} alt=""/>
 </div>;
}
