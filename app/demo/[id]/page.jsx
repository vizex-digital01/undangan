import {notFound} from 'next/navigation';
import {templateById,starterForTemplate,templates} from '@/lib/catalog';
import {admin} from '@/lib/server';
import {effectiveTemplates} from '@/lib/admin-v13';
import Invitation from '@/components/Invitation';
import Link from 'next/link';
export const dynamic='force-dynamic';
export default async function DemoPage({params}){const {id}=await params;const template=(await effectiveTemplates(admin())).find(t=>t.id===id);if(!template||!template.is_active)notFound();return <><div className="demo-toolbar"><Link href="/#templates">← Kembali ke katalog</Link><span>PREVIEW · {template.name}</span><Link href="/#templates">Pilih & custom ↗</Link></div><Invitation data={starterForTemplate(template)} template={template} preview /></>}
