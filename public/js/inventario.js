// VAR/ SELECTORS
const btnGuardarInventario = document.getElementById('btnGuardarInventario');
const cbxProducto = document.getElementById('cbxProducto');
const txtCantidad = document.getElementById('txtCantidad');
const txtNuevaCantidad = document.getElementById('txtNuevaCantidad');
const formInv = document.getElementById('formInv');

// EVENTS LISTENER
btnGuardarInventario.addEventListener('click', async function saveInventario(element) {
    element.preventDefault();
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
            let info = await fetch('/inventario', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let info2 = await info.json();
            if (info2.ok) {
                formInv.reset();
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

});
cbxProducto.addEventListener('change', setCantidad);

// START SOMES FUNCTIONS
fillCbxProducts();
renderizarInventario();

// FUNCTION

// TO FILL CBX PRODUCTS
async function fillCbxProducts() {
    try {
        let info = await fetch('/products');
        let data = await info.json();
        if (data.ok) {
            let products = data.productDB;
            console.log(products);
            let html = '';
            html += `<option value="" disabled selected>Seleccione un producto</option>`;
            products.map((product) => {
                html += `<option value="${product._id}">${product.nombre}</option>`;
            });
            cbxProducto.innerHTML = html;
        }
    } catch (e) {
        console.log('Error trying to get all products');
    }
}

// TO SET CANTIDAD
async function setCantidad() {
    let opt = cbxProducto.options[cbxProducto.selectedIndex];
    let data = {
        id: opt.value
    }
    try {
        let info = await fetch('/getCantidad', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data2 = await info.json();
        txtCantidad.value = data2.cantidadProduct.cantidad;
        // console.log(data2.cantidadProduct.cantidad);
    } catch (e) {
        console.log('Trying to set cantidad', e);
    }
}

// RENDERIZAR INVENTARIO
async function renderizarInventario() {
    try {
        let info = await fetch('/getInventario');
        let data = await info.json();
        console.log(data);
    } catch (e) {
        console.log('Error Trying to get all inventory');
    }
}