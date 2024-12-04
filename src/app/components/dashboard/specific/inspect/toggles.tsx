'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '@/app/components/dashboard/common/button';

export default function TreatmentToggle() {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();
    const [showTreatment, setTreatment] = useState(searchParams.get('showTreatment') === 'true');

    const updateUrl = useDebouncedCallback(() => {
        const params = new URLSearchParams(searchParams);
        params.set('showTreatment', String(showTreatment));
        replace(`${pathName}?${params.toString()}`, undefined);
    }, 500);

    useEffect(() => {
        updateUrl();
    }, [showTreatment, updateUrl]);

    const toggleTreatment = () => {
        setTreatment(!showTreatment);
    };

    // Determine button theme based on treatment state using Tailwind CSS classes
    const buttonTheme = showTreatment ? 'bg-blue-500 text-white' : 'bg-gray-500 text-black';

    return (
        <div className="flex justify-center">
            <Button
                onClick={toggleTreatment}
                className={`w-full flex justify-center font-bold text-base sm:text-sm md:text-sm text-justify ${buttonTheme}`}
            >
                {showTreatment ? 'Treatment' : 'Treatment'}
            </Button>
        </div>
    );
}

export function FullSearchToggle() {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();
    const [showFullSearch, setFullSearch] = useState(searchParams.get('showFullSearch') === 'true');

    const updateUrl = useDebouncedCallback(() => {
        const params = new URLSearchParams(searchParams);
        params.set('showFullSearch', String(showFullSearch));
        replace(`${pathName}?${params.toString()}`, undefined);
    }, 500);

    useEffect(() => {
        updateUrl();
    }, [showFullSearch, updateUrl]);

    const toggleFullSearch = () => {
        setFullSearch(!showFullSearch);
    };

    // Determine button theme based on treatment state using Tailwind CSS classes
    const buttonTheme = showFullSearch ? 'bg-blue-500 text-white' : 'bg-gray-500 text-black';

    return (
        <div className="flex justify-center">
            <Button
                onClick={toggleFullSearch}
                className={`w-full flex justify-center font-bold text-base sm:text-sm md:text-sm text-justify ${buttonTheme}`}
            >
                {showFullSearch ? 'Full Search' : 'Full Search'}
            </Button>
        </div>
    );
}
