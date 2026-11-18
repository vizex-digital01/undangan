/** Motion-only decoration. No text is baked into images, all clicks pass through. */
import {WEDDING_V25_SLUGS} from '@/lib/wedding-v25';
export default function WeddingOpeningLayers({slug}){
 if(!WEDDING_V25_SLUGS.includes(slug))return null;
 return <div className={`v25-motion-layer v25-motion-${slug}`} aria-hidden="true">
  {slug==='ivory'&&<><img className="v25-garland v25-garland-top" src="/themes/v25/floral-head.webp" alt=""/><img className="v25-garland v25-garland-bottom" src="/themes/v25/floral-foot.webp" alt=""/></>}
  <img className="v25-motif v25-motif-left" src={`/themes/v25/${slug}-element.svg`} alt=""/>
  <img className="v25-motif v25-motif-right" src={`/themes/v25/${slug}-element.svg`} alt=""/>
  <i className="v25-spark v25-spark-a"/><i className="v25-spark v25-spark-b"/>
  <i className="v25-spark v25-spark-c"/><i className="v25-spark v25-spark-d"/>
 </div>;
}
