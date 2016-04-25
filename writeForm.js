// create a document and pipe to a blob
var toCamelCase=(function(a,b,c){function f(s){var p='replace';return (b.test(s)?s[p](c,function(m,b){return b?'\u0020'+b:''}).toLowerCase():s)[p](a,function(m,i){return i.toUpperCase()})};f.pattern={divide:a,separate:b,split:c};return f})(/\s(\w)/g,/[\W_]/,/[\W_]+(.|$)/g);
window.makePDF = function() {
    var PDFDocument = require('pdfkit');
    var blobStream = require('blob-stream');
    var doc = new PDFDocument();
    var stream = doc.pipe(blobStream());

    function get(id) {
        // Iterates over the child nodes in the element extracting either text content or value
        var element = document.getElementById(id);
        if(!element) {
            throw Error('Attempted to get id which does not exist: ' + id);
        }
        var toReturn;
        if (element.value) {
            toReturn = element.value;
        } else {
            toReturn = element.textContent;
        }
        return toReturn;
    }

    var y_start = 200;
    function outputFieldName(fieldName, x, y) {
        doc.text(fieldName, x, y);
        var value = get(toCamelCase(fieldNames[i]));
        doc.text('$' + value, x + 135, y, { underline: true });
    }

    // Enumerate all labels and extract textContent to get
    // field names
    var allElements = document.getElementsByTagName('label');
    var fieldNames = [];
    for (var i = 0, n = allElements.length; i < n; ++i) {
      var el = allElements[i];
      if (el.textContent) { fieldNames.push(el.textContent); }
    }

    console.dir(fieldNames);

    // Write header stuff
    var companyName = 'FIRST CAROLINA MORTGAGE';
    var slogan = 'One stop shopping service for all mortgage products';
    doc.fontSize('18');
    doc.text(companyName, {align: 'center'});
    doc.fontSize('16');
    doc.text(slogan, {align: 'center'});
    doc.fontSize('18');
    doc.moveDown();
    doc.text('PRELIMINARY GOOD FAITH ESTIMATE', {align: 'center'});
    doc.fontSize('16');
    doc.text('Grady Patton... 336-312-5300... gpatton63@gmail.com', {align: 'center'});
    doc.fontSize('12');
    for(var i = 0; i < 20; i++) {
        outputFieldName(fieldNames[i], 85, y_start + (15*i));
    }
    for(var i = 20; i < fieldNames.length - 1; i++) {
        outputFieldName(fieldNames[i], 335, y_start + ( 15 * (i-20) ));
    }
    doc.moveDown();
    // Last field is total, line break it slightly
    outputFieldName(fieldNames[fieldNames.length - 1], 335, y_start + ( 15 * (fieldNames.length - 20)));

    doc.text('NMLS#110216', 85, 525);
    doc.text(get('address'), 85, 625);
    doc.text(get('contact'), 335, 625);

    // end and open the document in a new tab
    doc.end();
    stream.on('finish', function() {
        // window.open(`mailto:gpatton63@gmail.com?subject=Good Faith Estimate&body=See attached pdf&attachment="${stream.toBlobURL('application/pdf')}"`, '_blank');
        window.open(stream.toBlobURL('application/pdf'), '_blank');
    });
}