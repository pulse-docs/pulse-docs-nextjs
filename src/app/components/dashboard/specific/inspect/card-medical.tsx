'use client';
import React from 'react';
import { Card, CardContent, CardActions, Typography, Box, Button } from '@mui/material';
import { ViewCase } from './buttons';
import { copyToClipboard } from '@/app/utils/data.clipboard';

export function MedicalCard({
                              claim_id,
                              score,
                              matches,
                              matched,
                              extent_of_injury,
                              method_of_injury,
                              file_id,
                              treatment,
                              showTreatment
                            }: {
  claim_id: string,
  score: number,
  matches: number,
  matched: string[],
  extent_of_injury: string,
  method_of_injury: string,
  file_id: string,
  treatment: string,
  showTreatment: boolean
}) {
  return (
      <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', overflow: 'hidden', '&:hover': { boxShadow: 6, transform: 'scale(1.05)', transition: 'transform 0.3s ease-in-out' } }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'space-between', alignItems: 'start' }}>
            <Typography variant="h6">Score: {Math.round(score * 100) / 100}</Typography>
            <Typography variant="h6">Matches: {matches}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">Extent of Injury</Typography>
            <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => copyToClipboard(extent_of_injury)}>{extent_of_injury}</Typography>
          </Box>
        </CardContent>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'auto' }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">Method of Injury</Typography>
            <Typography variant="body2">{method_of_injury}</Typography>
          </Box>
          {showTreatment && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mt={2}>Treatment</Typography>
                <Typography variant="body2">{treatment}</Typography>
              </Box>
          )}
          <Box>
            {matched?.length > 0 && <Typography variant="subtitle1" fontWeight="bold" mt={2}>Matched Sections</Typography>}
            {matched?.map((match, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="body2">{match}</Typography>
                </Box>
            ))}
          </Box>
        </CardContent>
        <CardActions>
          <ViewCase id={file_id} />
        </CardActions>
      </Card>
  );
}