
import { Container, Typography } from '@mui/material';
import CaseForm from "../../../components/dashboard/CaseForm";

export default function CreateCasePage() {
    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Create New Case
            </Typography>
            <CaseForm />
        </Container>
    );
}