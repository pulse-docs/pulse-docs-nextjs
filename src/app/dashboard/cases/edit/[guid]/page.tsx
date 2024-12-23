import {CaseEdit} from '@/app/components/dashboard/CaseEdit';

export default async function EditPage({params}: {
    params: Promise<{guid: string}>
}){
    const {guid} = await params;
    return (
        <div>
            <CaseEdit guid={guid}/>
        </div>
    )
}