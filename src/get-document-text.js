const getDocumentText = ($doc) => {
    return $doc.text().replace(/\s\s/g, '');
    };
    
    module.exports = getDocumentText;