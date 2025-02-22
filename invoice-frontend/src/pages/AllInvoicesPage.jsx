// src/pages/AllInvoicesPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Snackbar,
  Alert,
  Collapse
} from '@mui/material';
import { getInvoices, getInvoiceDetails } from '../services/api';
import InvoiceFullDetails from '../components/InvoiceFullDetails';

const AllInvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await getInvoices();
      setInvoices(res.data.data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setErrorMsg('Error fetching invoices: ' + (error.response?.data?.error || error.message));
      setOpenSnackbar(true);
    }
    setLoading(false);
  };

  const handleViewDetails = async (invoiceId) => {
    if (expandedInvoiceId === invoiceId) {
      setExpandedInvoiceId(null);
      setInvoiceDetails(null);
      return;
    }
    try {
      const res = await getInvoiceDetails(invoiceId);
      setInvoiceDetails(res.data.data);
      setExpandedInvoiceId(invoiceId);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      setErrorMsg('Error fetching invoice details: ' + (error.response?.data?.error || error.message));
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        All Invoices
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Total Gross</TableCell>
                <TableCell>Payable</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <React.Fragment key={invoice.id}>
                  <TableRow>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                    <TableCell>{invoice.invoiceCurrency}</TableCell>
                    <TableCell>{invoice.totalGrossAmount}</TableCell>
                    <TableCell>{invoice.payableAmount}</TableCell>
                    <TableCell>{invoice.version || 'N/A'}</TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={() => handleViewDetails(invoice.id)}>
                        {expandedInvoiceId === invoice.id ? 'Hide Details' : 'View Details'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={7} sx={{ padding: 0 }}>
                      <Collapse in={expandedInvoiceId === invoice.id} timeout="auto" unmountOnExit>
                        {invoiceDetails && invoiceDetails.id === invoice.id && (
                          <InvoiceFullDetails invoice={invoiceDetails} />
                        )}
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography variant="body1" align="center">
                      No invoices found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AllInvoicesPage;
