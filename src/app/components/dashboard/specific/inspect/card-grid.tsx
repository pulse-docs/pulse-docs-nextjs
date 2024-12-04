import { Case } from '@/app/utils/definitions';
import {MedicalCard} from '@/app/components/dashboard/specific/inspect/card-medical';
import {getCaseByFuzzy, getCaseByFuzzyMRI, getCasesByFileId} from "@/app/lib/controllers/cases";

export async function CardGrid({query, topK, filter, showTreatment, fullSearch}: {query: string, topK: number, filter: string, showTreatment: boolean, fullSearch: boolean}) {
    const data: Case[] = await getCaseByFuzzy({query, topK, filter, fullSearch}) || [];

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((card, index) => (
                <MedicalCard key={index}
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
            ))}
        </div>
    );
    }