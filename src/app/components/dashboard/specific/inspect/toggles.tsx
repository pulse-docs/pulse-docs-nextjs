'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '@mui/material';

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

    return (
        <div className="flex justify-center">
            <Button
                onClick={toggleTreatment}
                variant={showTreatment ? 'contained' : 'outlined'}
                fullWidth
                sx={{ height: '100%'}}
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

    return (
        <div className="flex justify-center">
            <Button
                onClick={toggleFullSearch}
                variant={showFullSearch ? 'contained' : 'outlined'}
                fullWidth
                sx={{ height: '100%'}}
            >
                {showFullSearch ? 'Full Search' : 'Full Search'}
            </Button>
        </div>
    );
}