import {randomUUID} from 'node:crypto';
import {authorized} from '@/lib/admin-v13';
import {response,fail} from '@/lib/server';
export const dynamic='force-dynamic';
const allowed={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'};
export async function POST(req){
 try{
  const ctx=await authorized(req,true);if(ctx.error)return ctx.error;
  const data=await req.formData(),file=data.get('image');
  if(!file||typeof file.arrayBuffer!=='function')return fail('Pilih gambar ornamen terlebih dahulu');
  if(!allowed[file.type]||file.size>2*1024*1024||file.size<30)return fail('Format harus JPG, PNG, atau WEBP, maks. 2 MB');
  const bytes=Buffer.from(await file.arrayBuffer());
  const magic=(file.type==='image/png'&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))||
  (file.type==='image/jpeg'&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255)||
  (file.type==='image/webp'&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP');
  if(!magic)return fail('Isi file bukan gambar yang valid');
  const key=`ornaments/${randomUUID()}.${allowed[file.type]}`;
  const {error}=await ctx.db.storage.from('vizex-template-assets').upload(key,bytes,{contentType:file.type,upsert:false,cacheControl:'31536000'});
  if(error)throw error;
  const {data:publicUrl}=ctx.db.storage.from('vizex-template-assets').getPublicUrl(key);
  return response({url:publicUrl.publicUrl});
 }catch(err){console.error('Ornament upload',err);return fail('Gagal upload. Cek bucket vizex-template-assets dan migrasi v19.',500)}
}
