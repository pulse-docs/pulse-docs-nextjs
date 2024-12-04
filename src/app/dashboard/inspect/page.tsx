import Search from "@/app/components/dashboard/common/search";
import SearchLocal from "@/app/components/dashboard/common/search-local";
import {CardGrid} from "@/app/components/dashboard/specific/inspect/card-grid";
import {CardsSkeleton} from "@/app/components/dashboard/common/skeletons";
import {Suspense} from "react";
import NumberDropdown from "@/app/components/dashboard/specific/inspect/dropdown";
import TreatmentToggle from "@/app/components/dashboard/specific/inspect/toggles";
import {FullSearchToggle} from "@/app/components/dashboard/specific/inspect/toggles";


export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        filter?: string;
        page?: string;
        topK?: number;
        showTreatment?: boolean;
        fullSearch?: boolean;
    };
}) {
    const query = searchParams?.query || '';
    const filter = searchParams?.filter || '';
    const topK: number = Number(searchParams?.topK) || 12;
    const showTreatment: boolean = String(searchParams?.showTreatment) === 'true';
    const fullSearch: boolean = String(searchParams?.fullSearch) === 'true';


    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex w-full items-center justify-between">
                <h1 >Inspect</h1>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:gap-4 w-full mt-5">
                <div className="flex-grow md:basis-2/5">
                    <Search placeholder="Search extent of injury..."/>
                </div>
                <div className="flex-grow md:basis-2/5">
                    <SearchLocal placeholder="Search document text..."/>
                </div>
                <div className="w-full md:basis-1/5">
                    <NumberDropdown/>
                </div>
                <div className="w-full md:basis-1/5">
                    <TreatmentToggle />
                </div>
                <div className="w-full md:basis-1/5">
                    <FullSearchToggle />
                </div>
            </div>

            {/* Card Grid */}
            <div className="mt-10">
                <Suspense key={query} fallback={<CardsSkeleton/>}>
                <CardGrid query={query} topK={topK} filter={filter} showTreatment={showTreatment} fullSearch={fullSearch}/>
                </Suspense>
            </div>
        </div>
    );
}