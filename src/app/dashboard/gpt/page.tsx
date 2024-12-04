import PeerGPT from "@/app/components/dashboard/specific/peergpt/peergpt";

export default async function Page() {
    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex w-full items-center justify-between">
                <h1>PeerGPT</h1>
            </div>

            {/*<div className="flex flex-col gap-2 md:flex-row md:gap-4 w-full">*/}
            {/*    <div className="flex-grow md:basis-3/4">*/}
            {/*        <Search placeholder="Search documents... EOI and MOI"/>*/}
            {/*    </div>*/}
            {/*    <div className="w-full md:basis-1/4">*/}
            {/*        <NumberDropdown/>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <PeerGPT />
        </div>
    )
}