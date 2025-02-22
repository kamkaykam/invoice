// src/components/InvoiceDetailModal.jsx
import React from 'react';
import { Modal, Box, Typography, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InfoIcon from '@mui/icons-material/Info';
import CommentIcon from '@mui/icons-material/Comment';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: '60%' },
  bgcolor: 'background.paper',
  border: '2px solid #1D3944',
  boxShadow: 24,
  p: 4,
};

const InvoiceDetailModal = ({ open, onClose, invoice }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="invoice-modal-title">
      <Box sx={style}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="invoice-modal-title" variant="h6">
            Invoice Details: {invoice?.invoiceNumber}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarTodayIcon />
            <Typography variant="subtitle1">
              {invoice ? new Date(invoice.invoiceDate).toLocaleDateString() : ''}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <MonetizationOnIcon />
            <Typography variant="subtitle1">
              Total: {invoice?.totalGrossAmount} | Payable: {invoice?.payableAmount}
            </Typography>
          </Stack>
          {invoice?.version && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <InfoIcon />
              <Typography variant="subtitle1">
                Version: {invoice.version}
              </Typography>
            </Stack>
          )}
          <Stack direction="row" alignItems="center" spacing={1}>
            <CommentIcon />
            <Typography variant="body2" color="text.secondary">
              {invoice?.globalComment}
            </Typography>
          </Stack>
          {/* Additional details can be rendered here */}
        </Stack>
      </Box>
    </Modal>
  );
};

export default InvoiceDetailModal;
