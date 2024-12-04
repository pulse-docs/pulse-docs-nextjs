import { Case } from '@/app/utils/definitions';
import { MedicalCard } from '@/app/components/dashboard/specific/inspect/card-medical';
import { getCaseByFuzzy } from "@/app/lib/controllers/cases";
import { Grid2 as Grid } from '@mui/material';

export async function CardGrid({ query, topK, filter, showTreatment, fullSearch }: { query: string, topK: number, filter: string, showTreatment: boolean, fullSearch: boolean }) {
    const data: Case[] = await getCaseByFuzzy({ query, topK, filter, fullSearch }) || [];

    return (
        <Grid container spacing={3}>
            {data.map((card, index) => (
                <Grid size={{ sm:12, md: 6, lg: 3}} key={index}>
                    <MedicalCard
                        claim_id={card.claim_id}
                        matches={card.matches}
                        matched={card.matched}
                        score={card.score}
                        extent_of_injury={card.extent_of_injury}
                        method_of_injury={card.method_of_injury}
                        file_id={card.file_id}
                        treatment={card.treatment}
                        showTreatment={showTreatment}
                    />
                </Grid>
            ))}
        </Grid>
    );
}