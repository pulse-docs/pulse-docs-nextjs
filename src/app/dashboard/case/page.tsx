import Typography    from "@mui/material/Typography";
import {getDocumentCount}   from "@/app/gateway/mongo/mongo.data";

export default async function CasePage(){
    const count = await getDocumentCount();

    return (
           <Typography variant="h5" gutterBottom sx={{justifyContent: "center"}}>
                Case Page: {count} documents
           </Typography>
    )
}