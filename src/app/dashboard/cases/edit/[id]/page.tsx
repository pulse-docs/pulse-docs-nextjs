import CaseForm from "../../../../components/dashboard/CaseForm";

export default async function EditPage({params}: {
    params: Promise<{id: string}>
}){
    const {id} = await params;

    return (
        <div>
            <CaseForm id={id}/>
        </div>
    )
}