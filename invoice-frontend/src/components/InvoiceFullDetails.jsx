// src/components/InvoiceFullDetails.jsx
import React from 'react';
import { Box, Typography, Divider, Stack } from '@mui/material';

const InvoiceFullDetails = ({ invoice }) => {
  if (!invoice) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Invoice Full Details</Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={1}>
        <Typography variant="subtitle1">
          <strong>Invoice Number:</strong> {invoice.invoiceNumber}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Currency:</strong> {invoice.invoiceCurrency}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Total Gross:</strong> {invoice.totalGrossAmount}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Payable:</strong> {invoice.payableAmount}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Version:</strong> {invoice.version || 'N/A'}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Global Comment:</strong> {invoice.globalComment}
        </Typography>
        {/* You can expand below to show additional details from associated models */}
        {invoice.Delivery && (
          <>
            <Divider sx={{ mt: 2, mb: 1 }} />
            <Typography variant="h6">Delivery Details</Typography>
            <Typography variant="body1">
              <strong>Delivery Date:</strong> {invoice.Delivery.deliveryDate}
            </Typography>
            {invoice.Delivery.Address && (
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2">
                  <strong>Name:</strong> {invoice.Delivery.Address.Name}
                </Typography>
                <Typography variant="body2">
                  <strong>Street:</strong> {invoice.Delivery.Address.Street}
                </Typography>
                <Typography variant="body2">
                  <strong>Town:</strong> {invoice.Delivery.Address.Town}
                </Typography>
                <Typography variant="body2">
                  <strong>ZIP:</strong> {invoice.Delivery.Address.ZIP}
                </Typography>
                <Typography variant="body2">
                  <strong>Country:</strong> {invoice.Delivery.Address.Country._ || invoice.Delivery.Address.Country} ({invoice.Delivery.Address.Country.$?.CountryCode})
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {invoice.Delivery.Address.Email}
                </Typography>
              </Box>
            )}
            {invoice.Delivery.Contact && (
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2">
                  <strong>Contact Salutation:</strong> {invoice.Delivery.Contact.Salutation}
                </Typography>
                <Typography variant="body2">
                  <strong>Contact Name:</strong> {invoice.Delivery.Contact.Name}
                </Typography>
              </Box>
            )}
          </>
        )}
        {invoice.Biller && (
          <>
            <Divider sx={{ mt: 2, mb: 1 }} />
            <Typography variant="h6">Biller Details</Typography>
            <Typography variant="body1">
              <strong>VAT Identification:</strong> {invoice.Biller.vatIdentificationNumber}
            </Typography>
            <Typography variant="body1">
              <strong>Invoice Recipients Biller ID:</strong> {invoice.Biller.invoiceRecipientsBillerID}
            </Typography>
            {/* Expand to show further identifications, address and contact if available */}
          </>
        )}
        {invoice.InvoiceRecipient && (
          <>
            <Divider sx={{ mt: 2, mb: 1 }} />
            <Typography variant="h6">Invoice Recipient Details</Typography>
            <Typography variant="body1">
              <strong>VAT Identification:</strong> {invoice.InvoiceRecipient.vatIdentificationNumber}
            </Typography>
            {invoice.InvoiceRecipient.OrderReference && (
              <>
                <Typography variant="body1">
                  <strong>Order ID:</strong> {invoice.InvoiceRecipient.OrderReference.orderId}
                </Typography>
                <Typography variant="body1">
                  <strong>Reference Date:</strong> {new Date(invoice.InvoiceRecipient.OrderReference.referenceDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  <strong>Description:</strong> {invoice.InvoiceRecipient.OrderReference.description}
                </Typography>
              </>
            )}
            {/* Expand to include address and contact details if available */}
          </>
        )}
        {/* Add similar blocks for ItemList, PaymentMethod, PaymentConditions, etc. */}
      </Stack>
    </Box>
  );
};

export default InvoiceFullDetails;
