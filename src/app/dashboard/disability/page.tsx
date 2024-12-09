import { Suspense } from 'react';
import { Typography, Box } from '@mui/material';
import Disability from '@/app/components/dashboard/specific/disability/disability';

export default async function Page() {
    return (
        <Box width="100%">
            {/* Header */}
            <Box display="flex" width="100%" alignItems="center" justifyContent="space-between">
                <Typography variant="h4">Disability</Typography>
            </Box>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} width="100%">
                <Box flexGrow={1} flexBasis={{ md: '50%' }}>
                    <Disability />
                </Box>
            </Box>
        </Box>
    );
}