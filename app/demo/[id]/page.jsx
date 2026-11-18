import {notFound} from 'next/navigation';
import {templateById,starterData,templates} from '@/lib/catalog';
import Invitation from '@/components/Invitation';
import Link from 'next/link';
export function generateStaticParams(){return templates.map(t=>({id:t.id}))}
export default async function DemoPage({params}){const {id}=await params;const template=templateById(id);if(!template)notFound();return <><div className="demo-toolbar"><Link href="/#templates">← Kembali ke katalog</Link><span>PREVIEW · {template.name}</span><Link href="/#templates">Pilih & custom ↗</Link></div><Invitation data={starterData} template={template} preview /></>}
