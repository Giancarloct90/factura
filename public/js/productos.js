// VAR/SELECTOR
const txtNombre = document.getElementById('txtNombre');
const txtDescripcion = document.getElementById('txtDescripcion');
const txtPrecioUni = document.getElementById('txtPrecioUni');
const btnGuardarProducto = document.getElementById('btnGuardarProducto');
const lblNotify = document.getElementById('lblNotify');
const divTable = document.getElementById('divTable');
const btnGuardarInventario = document.getElementById('btnGuardarInventario');
const cbxProducto = document.getElementById('cbxProducto');
const txtCantidad = document.getElementById('txtCantidad');
const txtNuevaCantidad = document.getElementById('txtNuevaCantidad');
// const formInv = document.getElementById('formInv');
var arrayProducts;



// EVENT LISTENER
document.addEventListener('DOMContentLoaded', main);
btnGuardarProducto.addEventListener('click', saveProduct);
btnGuardarInventario.addEventListener('click', saveInventario);
cbxProducto.addEventListener('change', setCantidad);

// FUNTIONS
// INIT
async function main() {
    await renderizarProducts();
    fillCbxProducts();
}

// TO INSERT A NEW STOCK
async function saveInventario() {
    let opt = cbxProducto.options[cbxProducto.selectedIndex];
    // console.log('value', opt.value);
    // console.log('text', opt.text);
    if (opt.value && opt.text && txtCantidad.value && txtNuevaCantidad.value) {
        // let final = parseFloat(txtCantidad.value) + parseFloat(txtNuevaCantidad.value);
        // console.log(final);
        let data = {
            productId: opt.value,
            cantidad: parseFloat(txtCantidad.value) + parseFloat(txtNuevaCantidad.value)
        }
        try {
            let info = await fetch('/newStock', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let info2 = await info.json();
            if (info2.ok) {
                await renderizarProducts();
                txtCantidad.value = '';
                txtNuevaCantidad.value = '';
                console.log(info2);
            }
        } catch (e) {
            console.log('Error trying to insert invetorio to db');
        }
    } else {
        lblNotify.style.color = 'red';
        lblNotify.innerHTML = 'Todos los campos son obligatorios';
        lblNotify.classList.add('showNotidy');
    }

}

// TO INSERT DATA INTO DB
async function saveProduct() {
    if (txtNombre.value && txtDescripcion.value && txtPrecioUni.value) {
        lblNotify.classList.remove('showNotidy');
        let data = {
            nombre: txtNombre.value,
            descripcion: txtDescripcion.value,
            precio: txtPrecioUni.value
        }
        try {
            let info = await fetch('/productos', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let products = await info.json();
            if (products.ok) {
                console.log(products);
                await renderizarProducts();
                fillCbxProducts();
                txtNombre.value = '';
                txtDescripcion.value = '';
                txtPrecioUni.value = '';
            } else {
                throw new Error;
            }
        } catch (e) {
            console.log('Error trying to insert', e);
        }
    } else {
        lblNotify.style.color = 'red';
        lblNotify.innerHTML = 'Todos los campos son obligatorios';
        lblNotify.classList.add('showNotidy');
        // alert('Todos los campos son necesarios');
    }
}

// TO DRAW ALL PRODUCTS
async function renderizarProducts() {
    try {
        let info = await fetch('/products');
        let data = await info.json();
        if (data.ok) {
            arrayProducts = data.productDB;
            let products = data.productDB;
            let html = '';
            html += `<table class="table" id="tableProducts">`;
            html += `<thead>`;
            html += `<tr>`;
            html += `<th scope="col">Nombre</th>`;
            html += `<th scope="col">Descripcion</th>`;
            html += `<th scope="col">Stock</th>`;
            html += `<th scope="col">Precio</th>`;
            html += `<th scope="col">Acciones</th>`;
            html += `</tr>`;
            html += `</thead>`;
            html += `<tbody>`;
            products.map((product) => {
                html += `<tr>`;
                html += `<th>${product.nombre}</th>`;
                html += `<td>${product.descripcion}</td>`;
                html += `<td>${product.cantidad}</td>`;
                html += `<td>${product.precio}</td>`;
                html += `<td><button class="btn btn-danger" id="${product._id}" onclick="deleteProduct(this)">Borrar</button></td>`;
                html += `</tr>`;

            });
            html += `</tbody>`;
            html += `</table>`;
            divTable.innerHTML = html;
        } else {
            console.log(data);
        }
    } catch (e) {
        console.log('Error trying to get all products', e);
    }
}


//TO DELETE A PRODUCTS
async function deleteProduct(element) {
    let data = {
        id: element.getAttribute('id')
    }
    try {
        let info = await fetch('/deleteProducts', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let products = await info.json();
        if (products.ok) {
            renderizarProducts();
        } else {
            throw new Error;
        }
    } catch (e) {
        console.log('Error trying to delete a product');
    }
}

// TO FILL CBX PRODUCTS
async function fillCbxProducts() {
    try {
        let html = '';
        html += `<option value="" disabled selected>Seleccione un producto</option>`;
        arrayProducts.map((product) => {
            html += `<option value="${product._id}">${product.nombre}</option>`;
        });
        cbxProducto.innerHTML = html;
    } catch (e) {
        console.log('Error trying to get all products', e);
    }
}

// TO SET CANTIDAD
async function setCantidad() {
    let opt = cbxProducto.options[cbxProducto.selectedIndex];
    let cantidad = arrayProducts.filter(products => products._id == opt.value)[0].cantidad;
    txtCantidad.value = cantidad;
    // try {
    //     let info = await fetch('/getCantidad', {
    //         method: 'POST',
    //         body: JSON.stringify(data),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });
    //     let data2 = await info.json();
    //     // console.log(data2.cantidadProduct.cantidad);
    // } catch (e) {
    //     console.log('Trying to set cantidad', e);
    // }
}