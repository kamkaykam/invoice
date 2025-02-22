// services/invoiceService.js
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { validateXml } = require('../utils/xmlValidator');
const { parseXml } = require('../utils/xmlParser');
const Invoice = require('../models/Invoice');
// Import additional models as needed (Delivery, Biller, etc.)
const Delivery = require('../models/Delivery');
const Biller = require('../models/Biller');
const InvoiceRecipient = require('../models/InvoiceRecipient');
const ItemList = require('../models/ItemList');
const PaymentMethod = require('../models/PaymentMethod');
const UniversalBankTransaction = require('../models/UniversalBankTransaction');
const PaymentConditions = require('../models/PaymentConditions');
const Discount = require('../models/Discount');

// Helper functions for processing sections (Delivery, Biller, etc.) remain the same
async function processDelivery(deliveryData, invoiceId) {
  console.log('Processing Delivery section...');
  const deliveryRecord = await Delivery.create({
    deliveryDate: deliveryData.Date
  });
  await deliveryRecord.setInvoice(invoiceId);
  console.log('Delivery record created.');

  if (deliveryData.Address) {
    console.log('Processing Delivery Address...');
    await require('../models/Address').create({
      type: 'Delivery',
      name: deliveryData.Address.Name,
      street: deliveryData.Address.Street,
      town: deliveryData.Address.Town,
      zip: deliveryData.Address.ZIP,
      country: deliveryData.Address.Country._ || deliveryData.Address.Country,
      countryCode: deliveryData.Address.Country.$ ? deliveryData.Address.Country.$.CountryCode : null,
      email: deliveryData.Address.Email || null
    });
    console.log('Delivery Address processed.');
  }
  if (deliveryData.Contact) {
    console.log('Processing Delivery Contact...');
    await require('../models/Contact').create({
      type: 'Delivery',
      salutation: deliveryData.Contact.Salutation,
      name: deliveryData.Contact.Name
    });
    console.log('Delivery Contact processed.');
  }
}

async function processBiller(billerData, invoiceId) {
  console.log('Processing Biller section...');
  const billerRecord = await Biller.create({
    vatIdentificationNumber: billerData.VATIdentificationNumber,
    invoiceRecipientsBillerID: billerData.InvoiceRecipientsBillerID
  });
  await billerRecord.setInvoice(invoiceId);
  console.log('Biller record created.');

  if (billerData.FurtherIdentification) {
    console.log('Processing Biller FurtherIdentification...');
    const furtherIds = Array.isArray(billerData.FurtherIdentification)
      ? billerData.FurtherIdentification
      : [billerData.FurtherIdentification];
    for (const fid of furtherIds) {
      await require('../models/FurtherIdentification').create({
        identificationType: fid.$.IdentificationType,
        identificationValue: fid._
      }).then(record => record.setBiller(billerRecord.id));
    }
    console.log('Biller FurtherIdentification processed.');
  }
  if (billerData.Address) {
    console.log('Processing Biller Address...');
    await require('../models/Address').create({
      type: 'Biller',
      name: billerData.Address.Name,
      street: billerData.Address.Street,
      town: billerData.Address.Town,
      zip: billerData.Address.ZIP,
      country: billerData.Address.Country._ || billerData.Address.Country,
      countryCode: billerData.Address.Country.$ ? billerData.Address.Country.$.CountryCode : null,
      email: billerData.Address.Email || null
    });
    console.log('Biller Address processed.');
  }
  if (billerData.Contact) {
    console.log('Processing Biller Contact...');
    await require('../models/Contact').create({
      type: 'Biller',
      salutation: billerData.Contact.Salutation,
      name: billerData.Contact.Name
    });
    console.log('Biller Contact processed.');
  }
}

async function processInvoiceRecipient(recipientData, invoiceId) {
  console.log('Processing InvoiceRecipient section...');
  const recipientRecord = await InvoiceRecipient.create({
    vatIdentificationNumber: recipientData.VATIdentificationNumber
  });
  await recipientRecord.setInvoice(invoiceId);
  console.log('InvoiceRecipient record created.');

  if (recipientData.OrderReference) {
    console.log('Processing OrderReference for InvoiceRecipient...');
    await require('../models/OrderReference').create({
      orderId: recipientData.OrderReference.OrderID,
      referenceDate: recipientData.OrderReference.ReferenceDate,
      description: recipientData.OrderReference.Description
    }).then(record => record.setInvoiceRecipient(recipientRecord.id));
    console.log('OrderReference processed.');
  }
  if (recipientData.Address) {
    console.log('Processing Recipient Address...');
    await require('../models/Address').create({
      type: 'Recipient',
      name: recipientData.Address.Name,
      street: recipientData.Address.Street,
      town: recipientData.Address.Town,
      zip: recipientData.Address.ZIP,
      country: recipientData.Address.Country._ || recipientData.Address.Country,
      countryCode: recipientData.Address.Country.$ ? recipientData.Address.Country.$.CountryCode : null,
      email: recipientData.Address.Email || null,
      phone: recipientData.Address.Phone || null
    });
    console.log('Recipient Address processed.');
  }
  if (recipientData.Contact) {
    console.log('Processing Recipient Contact...');
    await require('../models/Contact').create({
      type: 'Recipient',
      salutation: recipientData.Contact.Salutation,
      name: recipientData.Contact.Name
    });
    console.log('Recipient Contact processed.');
  }
}

async function processDetails(detailsData, invoiceId) {
  console.log('Processing Details section...');
  if (detailsData.ItemList) {
    const itemLists = Array.isArray(detailsData.ItemList) ? detailsData.ItemList : [detailsData.ItemList];
    for (const il of itemLists) {
      console.log('Processing an ItemList...');
      const itemListRecord = await ItemList.create({
        headerDescription: il.HeaderDescription || null,
        footerDescription: il.FooterDescription || null
      });
      await itemListRecord.setInvoice(invoiceId);
      console.log('ItemList created.');

      if (il.ListLineItem) {
        const lineItems = Array.isArray(il.ListLineItem) ? il.ListLineItem : [il.ListLineItem];
        for (const li of lineItems) {
          console.log('Processing a ListLineItem...');
          const lineItemRecord = await require('../models/ListLineItem').create({
            description: li.Description,
            quantity: li.Quantity._ || li.Quantity,
            unit: li.Quantity.$ ? li.Quantity.$.Unit : null,
            unitPrice: li.UnitPrice,
            baseQuantity: li.Quantity.$ && li.Quantity.$.BaseQuantity ? li.Quantity.$.BaseQuantity : 1,
            lineItemAmount: li.LineItemAmount
          });
          await lineItemRecord.setItemList(itemListRecord.id);
          console.log('ListLineItem created.');

          if (li.InvoiceRecipientsOrderReference) {
            console.log('Processing InvoiceRecipientsOrderReference for ListLineItem...');
            await require('../models/LineItemOrderReference').create({
              orderId: li.InvoiceRecipientsOrderReference.OrderID,
              orderPositionNumber: li.InvoiceRecipientsOrderReference.OrderPositionNumber
            }).then(record => record.setListLineItem(lineItemRecord.id));
            console.log('InvoiceRecipientsOrderReference processed.');
          }
          if (li.TaxItem) {
            console.log('Processing TaxItem for ListLineItem...');
            await require('../models/LineItemTaxItem').create({
              taxableAmount: li.TaxItem.TaxableAmount,
              taxPercent: li.TaxItem.TaxPercent._ || li.TaxItem.TaxPercent,
              taxCategoryCode: li.TaxItem.TaxPercent.$ ? li.TaxItem.TaxPercent.$.TaxCategoryCode : null
            }).then(record => record.setListLineItem(lineItemRecord.id));
            console.log('TaxItem processed.');
          }
        }
      }
    }
  }
  console.log('Details section processed.');
}

async function processPaymentMethod(paymentData, invoiceId) {
  console.log('Processing PaymentMethod section...');
  const paymentRecord = await PaymentMethod.create({
    methodType: paymentData.UniversalBankTransaction ? 'UniversalBankTransaction' : 'Other',
    comment: paymentData.Comment || null
  });
  await paymentRecord.setInvoice(invoiceId);
  console.log('PaymentMethod record created.');

  if (paymentData.UniversalBankTransaction) {
    console.log('Processing UniversalBankTransaction...');
    const ubtRecord = await UniversalBankTransaction.create({
      consolidatorPayable: false
    });
    await ubtRecord.setPaymentMethod(paymentRecord.id);
    console.log('UniversalBankTransaction created.');

    if (paymentData.UniversalBankTransaction.BeneficiaryAccount) {
      console.log('Processing BeneficiaryAccount...');
      await require('../models/BeneficiaryAccount').create({
        bic: paymentData.UniversalBankTransaction.BeneficiaryAccount.BIC,
        iban: paymentData.UniversalBankTransaction.BeneficiaryAccount.IBAN,
        bankAccountOwner: paymentData.UniversalBankTransaction.BeneficiaryAccount.BankAccountOwner
      }).then(record => record.setUniversalBankTransaction(ubtRecord.id));
      console.log('BeneficiaryAccount processed.');
    }
  }
}

async function processPaymentConditions(paymentCondData, invoiceId) {
  console.log('Processing PaymentConditions section...');
  const paymentConditionsRecord = await PaymentConditions.create({
    dueDate: paymentCondData.DueDate,
    comment: paymentCondData.Comment || null
  });
  await paymentConditionsRecord.setInvoice(invoiceId);
  console.log('PaymentConditions record created.');

  if (paymentCondData.Discount) {
    console.log('Processing Discounts...');
    const discounts = Array.isArray(paymentCondData.Discount)
      ? paymentCondData.Discount
      : [paymentCondData.Discount];
    for (const disc of discounts) {
      await Discount.create({
        paymentDate: disc.PaymentDate,
        percentage: disc.Percentage
      }).then(record => record.setPaymentCondition(paymentConditionsRecord.id));
    }
    console.log('Discounts processed.');
  }
}

/**
 * Main function: Process the entire invoice XML.
 */
async function processInvoice(req) {
  console.log('Starting invoice processing...');
  let xmlContent = '';

  if (req.file) {
    console.log('Reading XML from uploaded file...');
    xmlContent = await fs.readFile(req.file.path, 'utf8');
  } else if (req.body.xmlurl) {
    console.log('Fetching XML from URL...');
    const response = await axios.get(req.body.xmlurl);
    xmlContent = response.data;
  } else {
    throw new Error('No XML file or URL provided');
  }

  console.log('XML content loaded. Validating XML...');
  try {
    await validateXml(xmlContent);
    console.log('XML validated successfully.');
  } catch (validationError) {
    console.error('XML validation failed:', validationError);
    throw new Error(`XML validation failed: ${validationError.message}`);
  }

  console.log('Parsing XML content...');
  const parsedXml = await parseXml(xmlContent);
  const invoiceData = parsedXml.Invoice;

  // Check for duplicate invoice number before creating
  const existingInvoice = await Invoice.findOne({ where: { invoiceNumber: invoiceData.InvoiceNumber } });
  if (existingInvoice) {
    throw new Error(`Duplicate Invoice: An invoice with number ${invoiceData.InvoiceNumber} already exists.`);
  }

  console.log('Creating Invoice record...');
  let invoiceRecord;
  try {
    invoiceRecord = await Invoice.create({
      invoiceNumber: invoiceData.InvoiceNumber,
      generatingSystem: invoiceData.$.GeneratingSystem,
      documentType: invoiceData.$.DocumentType,
      invoiceCurrency: invoiceData.$.InvoiceCurrency,
      language: invoiceData.$.Language,
      invoiceDate: invoiceData.InvoiceDate,
      totalGrossAmount: invoiceData.TotalGrossAmount || null,
      payableAmount: invoiceData.PayableAmount || null,
      globalComment: invoiceData.Comment || null,
      version: invoiceData.$.version || null
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new Error(`Duplicate Invoice Error: Invoice with number ${invoiceData.InvoiceNumber} already exists.`);
    }
    throw err;
  }
  console.log('Invoice record created with ID:', invoiceRecord.id);

  // Process associated sections
  if (invoiceData.Delivery) {
    await processDelivery(invoiceData.Delivery, invoiceRecord.id);
  }
  if (invoiceData.Biller) {
    await processBiller(invoiceData.Biller, invoiceRecord.id);
  }
  if (invoiceData.InvoiceRecipient) {
    await processInvoiceRecipient(invoiceData.InvoiceRecipient, invoiceRecord.id);
  }
  if (invoiceData.Details) {
    await processDetails(invoiceData.Details, invoiceRecord.id);
  }
  if (invoiceData.PaymentMethod) {
    await processPaymentMethod(invoiceData.PaymentMethod, invoiceRecord.id);
  }
  if (invoiceData.PaymentConditions) {
    await processPaymentConditions(invoiceData.PaymentConditions, invoiceRecord.id);
  }

  console.log('Invoice processing completed.');
  return invoiceRecord;
}

module.exports = {
  processInvoice
};
