// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const uploadInvoice = (formData) => {
  return api.post('/invoices/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getInvoices = () => {
  return api.get('/invoices');
};

export const getInvoiceDetails = (id) => {
  return api.get(`/invoices/${id}`);
};

export const uploadInvoiceByUrl = (xmlUrl) => {
  // If you decide to support URL-based upload, your backend should check for xmlurl in the body.
  return api.post('/invoices/upload', { xmlurl: xmlUrl });
};

export default api;
