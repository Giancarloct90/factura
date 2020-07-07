// VAR/SELECTORS
const divTable = document.getElementById('divTable');

// EVENT LISTENER


// INIT SOMES FUNCTIONS
renderizarFacturas();

// FUNCTIONS

async function renderizarFacturas() {
    try {
        let html = "";
        let data = await fetch('/getAllFacturas');
        let info = await data.json();
        // console.log(info.facturasDB);
        html += '<table class="table" id="factTable">';
        html += '<thead>';
        html += '<tr>';
        html += '<th scope="col">Nombre del Cliente</th>';
        html += '<th scope="col">RTN</th>';
        html += '<th scope="col">Fecha</th>';
        html += '<th scope="col">Total a Pagar</th>';
        html += '<th scope="col">Acciones</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        info.facturasDB.map(factura => {

            html += '<tr>';
            html += `<td>${factura.nombreCliente}</td>`;
            html += `<td>${factura.rtn}</td>`;
            html += `<td>${factura.fecha}</td>`;
            html += `<td>${factura.total}</td>`;
            html += `<td><a href="http://localhost:3000/facturasPDF/${factura.pdf}.pdf" target="_blank" class="btn btn-info">VER DETALLE</a></td>`;
            html += '</tr>';
        });

        html += '</tbody>';
        html += '</table>';
        divTable.innerHTML = html;
    } catch (e) {
        console.log('Error tryin to get all facturas', e);
    }

}