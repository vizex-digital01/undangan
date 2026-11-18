import {authorized,audit} from '@/lib/admin-v13';
import {response,fail} from '@/lib/server';
import {templates} from '@/lib/catalog';
import {normalizeAnimation,initialAnimationForTemplate} from '@/lib/animation-config';
export const dynamic='force-dynamic';
export async function GET(req){
 try{
  const ctx=await authorized(req);if(ctx.error)return ctx.error;
  const id=new URL(req.url).searchParams.get('template')||'';
  if(!templates.some(t=>t.id===id))return fail('Template tidak ditemukan',404);
  const {data,error}=await ctx.db.from('vizex_template_animations').select('config').eq('template_id',id).maybeSingle();
  if(error)throw error;
  return response({config:data?.config?normalizeAnimation(data.config):initialAnimationForTemplate(templates.find(t=>t.id===id))});
 }catch(err){console.error('Animation Studio GET',err);return fail('Gagal membuka studio. Pastikan migrasi v19 sudah dijalankan.',500)}
}
export async function POST(req){
 try{
  const ctx=await authorized(req,true);if(ctx.error)return ctx.error;
  const body=await req.json();
  if(!templates.some(t=>t.id===body.templateId))return fail('Template tidak ditemukan',404);
  if(!body.config||typeof body.config!=='object'||Array.isArray(body.config))return fail('Konfigurasi tidak valid');
  const config=normalizeAnimation(body.config);
  const {error}=await ctx.db.from('vizex_template_animations').upsert({template_id:body.templateId,config,updated_at:new Date().toISOString()},{onConflict:'template_id'});
  if(error)throw error;
  await audit(ctx.db,ctx.user,'update_animation','template',body.templateId,{ornamentCount:config.ornaments.length});
  return response({ok:true,config});
 }catch(err){console.error('Animation Studio POST',err);return fail('Gagal menyimpan animasi',500)}
}
