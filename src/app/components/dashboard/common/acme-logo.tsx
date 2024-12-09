import { Typography, Box } from '@mui/material';

export default function AcmeLogo() {
  return (
      <Box display="flex" flexDirection="row" alignItems="center"  sx={{ color: 'white', whiteSpace: 'nowrap' }}>
        {/* <BoltIcon className="h-15 w-15 rotate-[15deg]" /> */}
        <Typography variant="h3">Pulse Docs</Typography>
      </Box>
  );
}