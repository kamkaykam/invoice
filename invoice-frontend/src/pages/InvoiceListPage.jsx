import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Collapse
} from '@mui/material';
import { uploadInvoice, uploadInvoiceByUrl, getInvoices, getInvoiceDetails } from '../services/api';
import InvoiceCard from '../components/InvoiceCard';

const InvoiceListPage = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null); // Object: { type: 'error'|'success', text: string }
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  // Fetch the list of invoices (e.g., recent 10 uploads)
  const fetchInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const res = await getInvoices();
      // Optionally limit to 10 most recent uploads; you can also do this in the backend
      setInvoices((res.data.data || []).slice(0, 10));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setMessage({ type: 'error', text: 'Error fetching invoices: ' + (error.response?.data?.error || error.message) });
    }
    setLoadingInvoices(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // When file is selected
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // When URL input changes
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  // Upload using file
  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'No file selected' });
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('xmlfile', file);
    try {
      const res = await uploadInvoice(formData);
      setMessage({ type: 'success', text: res.data.message + ' (File uploaded)' });
      fetchInvoices();
    } catch (error) {
      console.error('Error uploading invoice:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setMessage({ type: 'error', text: 'Error uploading invoice (File): ' + errorMsg });
    }
    setUploading(false);
  };

  // Upload using URL
  const handleUrlUpload = async () => {
    if (!url) {
      setMessage({ type: 'error', text: 'No URL provided' });
      return;
    }
    setUploading(true);
    try {
      const res = await uploadInvoiceByUrl(url);
      setMessage({ type: 'success', text: res.data.message + ' (URL uploaded)' });
      fetchInvoices();
    } catch (error) {
      console.error('Error uploading invoice by URL:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setMessage({ type: 'error', text: 'Error uploading invoice (URL): ' + errorMsg });
    }
    setUploading(false);
  };

  // When clicking an invoice card, fetch and display its details inline
  const handleCardClick = async (invoiceId) => {
    if (expandedInvoiceId === invoiceId) {
      // Collapse if already expanded
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
      const errorMsg = error.response?.data?.error || error.message;
      setMessage({ type: 'error', text: 'Error fetching invoice details: ' + errorMsg });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Upload Section */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" gutterBottom>Upload Invoice</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Button variant="contained" component="label" color="secondary">
            Choose XML File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          <Button variant="contained" color="primary" onClick={handleUpload} disabled={uploading || !file}>
            {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload Invoice'}
          </Button>
          <TextField
            label="Or enter XML URL"
            variant="outlined"
            size="small"
            value={url}
            onChange={handleUrlChange}
            sx={{ minWidth: 300 }}
          />
          <Button variant="contained" color="primary" onClick={handleUrlUpload} disabled={uploading || !url}>
            {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload by URL'}
          </Button>
        </Box>
      </Paper>
      {/* Message Section */}
      {message && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: message.type === 'error' ? '#ffcccc' : '#ccffcc' }}>
          <Typography variant="body1" color={message.type === 'error' ? 'error' : 'green'}>
            {message.text}
          </Typography>
        </Paper>
      )}
      {/* Invoice Cards Section */}
      <Typography variant="h5" gutterBottom>Uploaded Invoices</Typography>
      {loadingInvoices ? (
        <CircularProgress />
      ) : invoices.length === 0 ? (
        <Typography variant="body1">No invoices found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {invoices.map((inv) => (
            <Grid item xs={12} key={inv.id}>
              <Box onClick={() => handleCardClick(inv.id)} sx={{ cursor: 'pointer' }}>
                <InvoiceCard invoice={inv} onSelect={handleCardClick} />
              </Box>
              <Collapse in={expandedInvoiceId === inv.id}>
                {invoiceDetails && invoiceDetails.id === inv.id && (
                  <Paper sx={{ p: 2, mt: 1 }}>
                    <Typography variant="subtitle1"><strong>Invoice Number:</strong> {invoiceDetails.invoiceNumber}</Typography>
                    <Typography variant="body2"><strong>Date:</strong> {new Date(invoiceDetails.invoiceDate).toLocaleDateString()}</Typography>
                    <Typography variant="body2"><strong>Currency:</strong> {invoiceDetails.invoiceCurrency}</Typography>
                    <Typography variant="body2"><strong>Total Gross:</strong> {invoiceDetails.totalGrossAmount}</Typography>
                    <Typography variant="body2"><strong>Payable:</strong> {invoiceDetails.payableAmount}</Typography>
                    {invoiceDetails.version && (
                      <Typography variant="body2"><strong>Version:</strong> {invoiceDetails.version}</Typography>
                    )}
                    <Typography variant="body2"><strong>Global Comment:</strong> {invoiceDetails.globalComment}</Typography>
                    {/* You can add further details from associated tables here */}
                  </Paper>
                )}
              </Collapse>
            </Grid>
          ))}
        </Grid>
      )}
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
      >
        <Alert severity={message?.type || 'info'} onClose={() => setMessage(null)}>
          {message?.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvoiceListPage;
