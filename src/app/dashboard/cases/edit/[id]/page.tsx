import CaseForm from "../../../../components/dashboard/CaseForm";

export default async function EditPage({params}: {
    params: Promise<{id: string}>
}){
    const {id} = await params;

    return (
        <div>
            <h1>Edit Page</h1>
            <p>Editing case with id: {id}</p>
            <CaseForm id={id}/>
        </div>
    )
}