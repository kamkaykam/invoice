const xml2js = require('xml2js');

function parseXml(xmlString) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(
      xmlString,
      { explicitArray: false, trim: true },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

module.exports = { parseXml };
