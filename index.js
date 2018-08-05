const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');
const { XmlDocument } = require('xmldoc');

function XFLLoader(content) {
  if (content !== 'PROXY-CS5') throw 'Incorrect XFL file';

  const callback = this.async();

  const xflDir = path.dirname(loaderUtils.getRemainingRequest(this));
  const domDocumentPath = path.resolve(xflDir, 'DomDocument.xml');
  this.dependency(domDocumentPath);
  const publishSettingsPath = path.resolve(xflDir, 'PublishSettings.xml');
  this.dependency(publishSettingsPath);

  fs.readFile(domDocumentPath, (err, data) => {
    if (err) throw err;
    const domDocumentXML = new XmlDocument(data);
    const fileGUID = domDocumentXML.attr['fileGUID'];
    fs.readFile(publishSettingsPath, (err, data) => {
      if (err) throw err;
      const publishSettingsXML = new XmlDocument(data);
      const profile = publishSettingsXML.childNamed('profile').childWithAttribute('name', 'JavaScript/HTML');
      if (!profile) throw 'Please save & publish Adobe Animate project first';
      const publishPath = profile.childWithAttribute('name', 'filename').val;
      if (!profile) throw 'Please save & publish Adobe Animate project first';
      const filePath = path.resolve(xflDir, '..', publishPath);
      this.dependency(filePath);

      fs.readFile(filePath, (err, data) => {
        const arr = data.toString().split('\n');
        // remove last line: var createjs, AdobeAn;
        arr.pop();
        const content = `let createjs = require('createjs');
let AdobeAn;
          
${arr.join('\n')}
          
module.exports = AdobeAn.getComposition('${fileGUID}')`;
        callback(null, content);
      });
    });
  });
}


module.exports = XFLLoader;
