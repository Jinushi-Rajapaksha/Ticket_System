// src/components/SummaryCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactElement<SvgIconProps>;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ mr: 2, color: color }}>
        {React.cloneElement(icon, { fontSize: 'large' })}
      </Box>
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography variant="subtitle1" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
