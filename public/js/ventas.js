// VAR/SELECTOR
const txtFecha = document.getElementById('txtFecha');
const cbxProducts = document.getElementById('cbxProducts');
const txtStock = document.getElementById('txtStock');
const txtPrecioUni = document.getElementById('txtPrecioUni');
const btnAddProduct = document.getElementById('btnAddProduct');
const txtCantidad = document.getElementById('txtCantidad');
const lblNoty = document.getElementById('lblNoty');
const tbDetalle = document.getElementById('tbDetalle');
const tbTotales = document.getElementById('tbTotales');
const btnGenFact = document.getElementById('btnGenFact');
const txtNombreCliente = document.getElementById('txtNombreCliente');
const txtRTN = document.getElementById('txtRTN');
const lblNotyFact = document.getElementById('lblNotyFact');
// const txtFecha = document.getElementById('txtFecha');
let subTotal = 0,
    totalFinal = 0,
    imp = 0,
    No = 0;

// EVENT LISTENER
document.addEventListener('DOMContentLoaded', main);
cbxProducts.addEventListener('change', fillFormProduct);
btnAddProduct.addEventListener('click', addProducts);
btnGenFact.addEventListener('click', genFactura);

//FUNCTION
// MAIN FUNCTION TO INIT PROJECT
async function main() {
    setFecha();
    fillCbx();
}

// TO GET DATE
function getFecha() {
    const date = new Date().getTime();
    return new Intl.DateTimeFormat('es-HN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(date);
    // const dateTimeFormat = new Intl.DateTimeFormat('es', {
    //     year: 'numeric',
    //     month: 'short',
    //     day: '2-digit',
    //     hour12: '2-digit',
    //     minute: '2-digit'
    // })
    // const [{
    //     value: month
    // }, , {
    //     value: day
    // }, , {
    //     value: year
    // }, {
    //     value: hours
    // }, {
    //     value: minute
    // }] = dateTimeFormat.formatToParts(date);
    // return {
    //     day,
    //     month,
    //     year
    // }
}

// SET FECHA
function setFecha() {
    txtFecha.value = getFecha();
}

//TO GET ALL PRODUCTS
async function getAllProducts() {
    try {
        let data = await fetch('/products');
        let info = await data.json();
        if (info.ok) {
            return info.productDB;
        }
        throw new Error;
    } catch (e) {
        console.log('Error trying to get all products');
    }
}

// TO FILL PRODUCTS FORM
async function fillCbx() {
    try {
        let products = await getAllProducts();
        // console.log(products);
        let html = '';
        html += `<option value="" disabled selected>Seleccione un producto</option>`;
        products.map(product => {
            html += `<option value="${product._id}">${product.nombre}</option>`
        });
        cbxProducts.innerHTML = html;
    } catch (e) {
        console.log('Error', e);
    }
}

// TO FILL FORM PRODUCTS
async function fillFormProduct() {
    let opt = cbxProducts.options[cbxProducts.selectedIndex];
    try {
        let products = await getAllProducts();
        let productF = products.filter(product => product._id === opt.value)[0];
        // console.log(productF);
        txtStock.value = productF.cantidad;
        txtPrecioUni.value = productF.precio;
    } catch (e) {
        console.log('Error');
    }
}

// TO ADD A NEW PRODUCTS
async function addProducts() {
    if (cbxProducts.value && txtStock.value && txtPrecioUni.value && txtCantidad.value) {
        lblNoty.style.display = 'none';
        let opt = cbxProducts.options[cbxProducts.selectedIndex];
        let rowProduct = document.createElement('tr');
        let html = '';
        No += 1
        // Detalle Producto
        rowProduct.setAttribute("id", `${opt.value}r`);
        rowProduct.setAttribute("class", "rowDeatils");
        html += `<th>${No}</th>`;
        html += `<td>${opt.text}</td>`;
        html += `<td>${txtPrecioUni.value}</td>`;
        html += `<td>${txtCantidad.value}</td>`;
        subTotal = parseFloat(subTotal) + (parseFloat(txtPrecioUni.value) * parseFloat(txtCantidad.value));
        html += `<td id="${opt.value}t">${parseFloat(txtPrecioUni.value)*parseFloat(txtCantidad.value)}</td>`;
        html += `<td><i id="${opt.value}" onclick="deleteProduct(this)" class="del fas fa-trash-alt"></i></td>`;
        rowProduct.innerHTML = html;
        tbDetalle.appendChild(rowProduct);

        genSubTotal(subTotal, false);

        // CLEAR FORM
        txtStock.value = '';
        txtPrecioUni.value = '';
        txtCantidad.value = '';
    } else {
        lblNoty.style.display = '';
        // alert('todos los campos son necesarios');
    }
}

// TO GENERATE SUNTOTAL DEATILS
function genSubTotal(total, flag) {
    if (flag) {
        total = parseFloat(subTotal) - parseFloat(total);
        subTotal = total;
    }
    let rowSubTotal = document.createElement('tr');
    let rowImp = document.createElement('tr');
    let rowTotal = document.createElement('tr');
    let html = '';
    tbTotales.innerHTML = '';

    // Sub total
    html += `<th scope="row"></th>`;
    html += `<td></td>`;
    html += `<td></td>`;
    html += `<td>Sub-Total</td>`;
    html += `<td id="subTotal">${total}</td>`;
    html += `<td></td>`;
    rowSubTotal.innerHTML = html;
    tbTotales.appendChild(rowSubTotal);

    // IMPUESTO SOBRE LA RENTA
    html = '';
    html += `<th scope="row"></th>`;
    html += `<td></td>`;
    html += `<td></td>`;
    html += `<td>ISR(15%)</td>`;
    imp = (parseFloat(total) * 0.15);
    html += `<td id="impTxt">${parseFloat(total)*0.15}</td>`;
    html += `<td></td>`;
    rowImp.innerHTML = html;
    tbTotales.appendChild(rowImp);

    //TOTAL A PAGAR
    html = '';
    html += `<th scope="row"></th>`;
    html += `<td></td>`;
    html += `<td></td>`;
    html += `<td>Total a Pagar</td>`;
    html += `<td id="totalTxt">${parseFloat(total)+imp}</td>`;
    html += `<td></td>`;
    rowTotal.innerHTML = html;
    tbTotales.appendChild(rowTotal);
}

// TO GENERATE FACTURA
async function genFactura() {

    if (subTotal && imp) {
        if (txtNombreCliente.value && txtRTN.value) {
            lblNotyFact.style.display = 'none';
            let row = tbDetalle.getElementsByClassName("rowDeatils");
            let arrDetalles = [];
            let detalles = {};
            for (let i = 0; i <= (row.length - 1); i++) {
                detalles = {};
                for (let ii = 0; ii <= (parseFloat(row[i].getElementsByTagName("td").length) - 2); ii++) {
                    detalles[ii] = row[i].getElementsByTagName("td")[ii].innerHTML;
                }
                arrDetalles.push(detalles);
            };
            console.log(arrDetalles);
            let data = {
                nombre: txtNombreCliente.value,
                rtn: txtRTN.value,
                fecha: txtFecha.value,
                detalle: arrDetalles,
                subtot: subTotal,
                impuesto: imp
            }
            let info = await fetch('/factura', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let info2 = await info.json();
            console.log(info2);
        } else {
            lblNotyFact.style.display = '';
            lblNotyFact.style.color = 'red';
            lblNotyFact.innerHTML = 'Nombre y RTN son OBLIGATORIOS!!!'
        }
    } else {
        lblNotyFact.style.display = '';
        lblNotyFact.style.color = 'red';
        lblNotyFact.innerHTML = 'La factura no tiene productos, Factura esta vacia'
    }
}

// TO DELETE A PRODUCT OF THE LIST
async function deleteProduct(element) {
    let row = element.getAttribute('id');
    let subTotal = document.getElementById(`${row + "t"}`).innerHTML;
    document.getElementById(`${row + "r"}`).remove();
    genSubTotal(subTotal, true);
    // console.log(su);
    // console.log(row + "r");
}