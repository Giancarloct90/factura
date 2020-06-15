// VAR/SELECTOR
const txtNombre = document.getElementById('txtNombre');
const txtDescripcion = document.getElementById('txtDescripcion');
const txtPrecioUni = document.getElementById('txtPrecioUni');
const btnGuardarProducto = document.getElementById('btnGuardarProducto');
const lblNotify = document.getElementById('lblNotify');
const divTable = document.getElementById('divTable');

// TRIGGER SOMES FUNCTIONS
renderizarProducts();

// EVENT LISTENER
btnGuardarProducto.addEventListener('click', saveProduct);

// FUNTIONS
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
                renderizarProducts();
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
            let products = data.productDB;
            let html = '';
            html += `<table class="table" id="tableProducts">`;
            html += `<thead>`;
            html += `<tr>`;
            html += `<th scope="col">Nombre</th>`;
            html += `<th scope="col">Descripcion</th>`;
            html += `<th scope="col">Precio</th>`;
            html += `<th scope="col">Acciones</th>`;
            html += `</tr>`;
            html += `</thead>`;
            html += `<tbody>`;
            products.map((product) => {
                html += `<tr>`;
                html += `<th>${product.nombre}</th>`;
                html += `<td>${product.descripcion}</td>`;
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