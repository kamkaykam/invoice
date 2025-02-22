// src/components/InvoiceDetails.jsx
import React from 'react';
import { Paper, Typography, Divider, Box, Stack } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CommentIcon from '@mui/icons-material/Comment';
import InfoIcon from '@mui/icons-material/Info';

const InvoiceDetails = ({ invoice }) => {
  if (!invoice) {
    return (
      <Typography variant="subtitle1" color="text.secondary">
        Select an invoice to see details.
      </Typography>
    );
  }
  return (
    <Paper elevation={4} sx={{ padding: 3, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Invoice Details</Typography>
        <Divider />
        <Box>
          <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'bold' }}>
            Invoice Number:
          </Typography>{' '}
          {invoice.invoiceNumber}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarTodayIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            {new Date(invoice.invoiceDate).toLocaleDateString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MonetizationOnIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            Total: {invoice.totalGrossAmount} | Payable: {invoice.payableAmount}
          </Typography>
        </Box>
        {invoice.version && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">
              Version: {invoice.version}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CommentIcon sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {invoice.globalComment}
          </Typography>
        </Box>
        {/* Extend here: If you want to display Delivery, Biller, etc., you can add additional sections */}
      </Stack>
    </Paper>
  );
};

export default InvoiceDetails;
