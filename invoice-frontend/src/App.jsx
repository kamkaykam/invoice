// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import InvoiceListPage from './pages/InvoiceListPage';
import AllInvoicesPage from './pages/AllInvoicesPage';

function App() {
  return (
    <Router>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <ReceiptLongIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Invoice Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/">
              Recent Uploads
            </Button>
            <Button color="inherit" component={Link} to="/all">
              All Invoices
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<InvoiceListPage />} />
          <Route path="/all" element={<AllInvoicesPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
