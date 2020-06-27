const pdfmake = require('pdfmake');
const path = require('path');
const fs = require('fs');

// TO GENRATE A PDF FACTURA
async function generatePDF(pdname, detalleFacturaDB, facturaDB) {

    let tablesDetalle = [];
    let title = ["Nombre Producto", "Precion Unitario", "Cantidad", "Total"];

    // TRYING TO FILL THE TABLE
    tablesDetalle.push(title);
    detalleFacturaDB.ops.map(detalle => {
        title = [];
        title.push(detalle.nombreProducto);
        title.push({
            text: `${detalle.precioUni}`,
            alignment: 'right'
        });
        title.push({
            text: `${detalle.cantidad}`,
            alignment: 'right'
        });
        title.push({
            text: `${detalle.total}`,
            alignment: 'right'
        });
        tablesDetalle.push(title);
    });
    tablesDetalle.push(["", "", "SubTotal", {
        text: `${facturaDB.subTotal}`,
        alignment: 'right'
    }]);
    tablesDetalle.push(["", "", "ISV(15%)", {
        text: `${facturaDB.imp}`,
        alignment: 'right'
    }]);
    tablesDetalle.push(["", "", "Total", {
        text: `${facturaDB.total}`,
        alignment: 'right'
    }]);


    let total = (parseFloat(facturaDB.subTotal) + parseFloat(facturaDB.imp));

    // IMPORT FONTS
    let fonts = {
        Roboto: {
            normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
            bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
            italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
            bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
        }
    };

    // DESIGN layout: 'noBorders',
    facturaGral = {
        pageSize: 'A4',
        footer: (currentPage, pageCount) => {
            return {
                text: `Pagina ${currentPage.toString()} de ${pageCount.toString()}`,
                alignment: 'center',
                fontSize: 11
            }
        },
        content: [{
                text: 'Factura',
                style: 'header',
                fontSize: 16,
                alignment: 'center',
                bold: true
            },
            {
                text: `Nombre del Cliente: ${facturaDB.nombreCliente}`,
                fontSize: 12,
                // table: {
                //     body: [
                //         [{
                //             text: 'Nombre Cliente:',
                //             fontSize: 11
                //         }, {
                //             text: `${facturaDB.nombreCliente}`,
                //             fontSize: 11
                //         }],
                //         [{
                //             text: 'RTN:',
                //             fontSize: 11
                //         }, {
                //             text: `${facturaDB.rtn}`,
                //             fontSize: 11
                //         }],
                //         [{
                //             text: 'Fecha:',
                //             fontSize: 11
                //         }, {
                //             text: `${facturaDB.fecha}`,
                //             fontSize: 11
                //         }]
                //     ]
                // }
            }, {
                text: `RNT: ${facturaDB.rtn}`,
                fontSize: 12,
            }, {
                text: `Fecha: ${facturaDB.fecha}`,
                fontSize: 12,
            }, {
                text: `Total a pagar: ${total} Lempiras`,
                fontSize: 12,
                bold: true
            },
            {
                text: `_____________________________________________________________________________________`,
                fontSize: 12,
                bold: true
            },
            {
                text: `Detalle de Factura`,
                fontSize: 13,
                bold: true,
                alignment: 'center'
            },
            {
                table: {
                    widths: [270, '*', '*', '*'],
                    body: tablesDetalle
                }
            }


        ]
    }

    // CREATION OF THE PDF
    var tempFile;
    let printer = new pdfmake(fonts);
    let pdfdoc = printer.createPdfKitDocument(facturaGral);
    let name = new Date().getTime();
    let nombreDireccionPDF = path.join(__dirname, `../../../public/facturasPDF/${pdname}.pdf`);
    pdfdoc.pipe(tempFile = fs.createWriteStream(nombreDireccionPDF));
    pdfdoc.end();
    tempFile.on('finish', async function (e) {
        return true;

    });

}

module.exports = {
    generatePDF
}