import Editor from '@/components/Editor';
export default async function EditPage({params}){const {id}=await params;return <Editor id={id}/>}
