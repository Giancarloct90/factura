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
let tot = 0,
    totalFinal = 0,
    imp = 0,
    No = 0;

// EVENT LISTENER
document.addEventListener('DOMContentLoaded', main);
cbxProducts.addEventListener('change', fillFormProduct);
btnAddProduct.addEventListener('click', addProducts);

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
        console.log(products);
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
        let tr = document.createElement('tr');
        let tr2 = document.createElement('tr');
        let tr3 = document.createElement('tr');
        let tr4 = document.createElement('tr');
        let html = '';
        No += 1
        // Detalle Producto
        html += `<tr>`;
        html += `<th scope="row">${No}</th>`;
        html += `<td>${opt.text}</td>`;
        html += `<td>${txtPrecioUni.value}</td>`;
        html += `<td>${txtCantidad.value}</td>`;
        tot = parseFloat(tot) + (parseFloat(txtPrecioUni.value) * parseFloat(txtCantidad.value));
        html += `<td>${parseFloat(txtPrecioUni.value)*parseFloat(txtCantidad.value)}</td>`;
        html += `<td>X</td>`;
        html += `</tr>`;
        tr.innerHTML = html;
        tbDetalle.appendChild(tr);


        html = '';
        tbTotales.innerHTML = '';

        // Sub total
        html += `<tr>`;
        html += `<th scope="row"></th>`;
        html += `<td></td>`;
        html += `<td></td>`;
        html += `<td>Sub-Total</td>`;
        html += `<td>${tot}</td>`;
        html += `<td></td>`;
        html += `</tr>`;
        tr2.innerHTML = html;
        tbTotales.appendChild(tr2);

        // IMPUESTO SOBRE LA RENTA
        html = '';
        html += `<tr>`;
        html += `<th scope="row"></th>`;
        html += `<td></td>`;
        html += `<td></td>`;
        html += `<td>ISR(15%)</td>`;
        imp = (parseFloat(tot) * 0.15);
        html += `<td>${parseFloat(tot)*0.15}</td>`;
        html += `<td></td>`;
        html += `</tr>`;
        tr3.innerHTML = html;
        tbTotales.appendChild(tr3);

        //TOTAL A PAGAR
        html = '';
        html += `<tr>`;
        html += `<th scope="row"></th>`;
        html += `<td></td>`;
        html += `<td></td>`;
        html += `<td>Total a Pagar</td>`;
        html += `<td>${parseFloat(tot)+imp}</td>`;
        115
        html += `<td></td>`;
        html += `</tr>`;
        tr4.innerHTML = html;
        tbTotales.appendChild(tr4);
        txtStock.value = '';
        txtPrecioUni.value = '';
        txtCantidad.value = '';
        console.log(tot);
    } else {
        lblNoty.style.display = '';
        // alert('todos los campos son necesarios');
    }
}