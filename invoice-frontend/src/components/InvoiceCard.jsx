import React from 'react';
import { Card, CardContent, Typography, CardActionArea, Box, Stack } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

const InvoiceCard = ({ invoice, onSelect }) => {
  return (
    <Card sx={{ marginBottom: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardActionArea onClick={() => onSelect(invoice.id)}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center">
            <DescriptionIcon color="secondary" />
            <Typography variant="h6">
              {invoice.invoiceNumber}
            </Typography>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {new Date(invoice.invoiceDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {invoice.invoiceCurrency}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mt: 1, fontWeight: 'medium' }}>
            Total: {invoice.totalGrossAmount} | Payable: {invoice.payableAmount}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default InvoiceCard;
