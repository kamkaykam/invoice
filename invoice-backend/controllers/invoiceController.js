// controllers/invoiceController.js

const invoiceService = require('../services/invoiceService');
const Invoice = require('../models/Invoice');
const Delivery = require('../models/Delivery');
const Biller = require('../models/Biller');
const InvoiceRecipient = require('../models/InvoiceRecipient');
const ItemList = require('../models/ItemList');
const PaymentMethod = require('../models/PaymentMethod');
const UniversalBankTransaction = require('../models/UniversalBankTransaction');
const PaymentConditions = require('../models/PaymentConditions');
const Discount = require('../models/Discount');

/**
 * POST /api/invoices/upload
 * Processes an invoice upload from either an XML file or a URL.
 */
exports.uploadInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.processInvoice(req);
    res.status(200).json({ message: 'Invoice processed successfully', data: invoice });
  } catch (error) {
    console.error('Error processing invoice:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/invoices
 * Returns a summary list of invoices.
 */
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      attributes: [
        'id',
        'invoiceNumber',
        'invoiceDate',
        'invoiceCurrency',
        'totalGrossAmount',
        'payableAmount',
        'version'
      ]
    });
    res.status(200).json({ message: 'Invoices fetched successfully', data: invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/invoices/:id
 * Returns full details of a specific invoice including associated data.
 */
exports.getInvoiceDetails = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id },
      include: [
        { model: Delivery },
        { model: Biller },
        { model: InvoiceRecipient },
        { model: ItemList },
        {
          model: PaymentMethod,
          include: [
            { model: UniversalBankTransaction }
          ]
        },
        {
          model: PaymentConditions,
          include: [
            { model: Discount }
          ]
        }
      ]
    });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.status(200).json({ message: 'Invoice details fetched successfully', data: invoice });
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    res.status(500).json({ error: error.message });
  }
};
