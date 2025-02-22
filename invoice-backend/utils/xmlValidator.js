// utils/xmlValidator.js
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

/**
 * Writes the provided XML content to a temporary file.
 * @param {string} xmlContent - The XML string.
 * @returns {Promise<string>} - The path to the temporary XML file.
 */
async function writeTempXml(xmlContent) {
  const tempFilePath = path.join(__dirname, '..', 'temp.xml');
  await fs.writeFile(tempFilePath, xmlContent, 'utf8');
  return tempFilePath;
}

/**
 * Validates an XML file against an XSD using xmllint.
 * @param {string} xmlFilePath - Path to the XML file.
 * @param {string} xsdFilePath - Path to the XSD file.
 * @returns {Promise<boolean>} - Resolves to true if valid.
 */
function validateWithXmllint(xmlFilePath, xsdFilePath) {
  return new Promise((resolve, reject) => {
    const cmd = `xmllint --schema "${xsdFilePath}" "${xmlFilePath}"`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('xmllint validation failed:', { error, stdout, stderr });
        // Include both stdout and stderr for maximum detail
        return reject(new Error(`XML Validation Error:\nSTDOUT: ${stdout}\nSTDERR: ${stderr}`));
      }
      console.log('xmllint validation successful.');
      resolve(true);
    });
  });
}

/**
 * Validates the XML content (string) against the Invoice.xsd.
 * Writes XML to a temporary file, validates, then cleans up.
 * @param {string} xmlContent - The XML content to validate.
 * @returns {Promise<boolean>} - Resolves if valid.
 */
async function validateXml(xmlContent) {
  console.log('Starting XML validation using xmllint...');
  const xsdPath = path.join(__dirname, '..', 'xsd', 'Invoice.xsd');
  const tempXmlPath = await writeTempXml(xmlContent);
  try {
    await validateWithXmllint(tempXmlPath, xsdPath);
    await fs.unlink(tempXmlPath); // Clean up temp file after successful validation
    return true;
  } catch (err) {
    await fs.unlink(tempXmlPath); // Clean up temp file on error as well
    throw err;
  }
}

module.exports = { validateXml };
