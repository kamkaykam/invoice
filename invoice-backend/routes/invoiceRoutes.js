const express = require('express');
const router = express.Router();
const multer = require('multer');
const invoiceController = require('../controllers/invoiceController');

const upload = multer({ dest: 'uploads/' });

// Use upload.single('xmlfile') so that Multer looks for a file with the key "xmlfile"
router.post('/upload', upload.single('xmlfile'), invoiceController.uploadInvoice);
router.get('/', invoiceController.getInvoices);
router.get('/:id', invoiceController.getInvoiceDetails);

module.exports = router;
