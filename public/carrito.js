// variables para los elementos del carrito
const carritoPopup = document.getElementById('carrito-popup');
const carritoCerrar = document.getElementById('carrito-cerrar');
const carritoLista = document.getElementById('carrito-lista');
const carritoTotal = document.getElementById('carrito-total');
const carritoCantidad = document.getElementById('carrito-cantidad');

// variables para botones de agregar
const agregarBtns = document.querySelectorAll('.agregar-btn');

// Objeto para almacenar los productos en el carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || {};

// Función para actualizar el carrito en la interfaz
function actualizarCarrito() {
    carritoLista.innerHTML = '';
    let total = 0;
    for (const [id, producto] of Object.entries(carrito)) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${producto.nombre} - $${producto.precio.toFixed(2)}</span>
            <button class="restar-btn" data-id="${id}">-</button>
            <span>${producto.cantidad}</span>
            <button class="sumar-btn" data-id="${id}">+</button>
        `;
        carritoLista.appendChild(li);
        total += producto.precio * producto.cantidad;
    }
    carritoTotal.textContent = `Total: $${total.toFixed(2)}`;
    carritoCantidad.textContent = Object.keys(carrito).length;
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para mostrar el carrito
function mostrarCarrito() {
    carritoPopup.style.display = 'block';
    actualizarCarrito();
}

// Función para ocultar el carrito
carritoCerrar.addEventListener('click', () => {
    carritoPopup.style.display = 'none';
});

// Función para agregar productos al carrito
agregarBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const producto = e.target.closest('.producto');
        const id = producto.querySelector('.producto-nombre').textContent;
        const precio = parseFloat(producto.querySelector('.producto-precio li').textContent.replace('$', ''));
        
        if (!carrito[id]) {
            carrito[id] = { nombre: id, precio: precio, cantidad: 1 };
        } else {
            carrito[id].cantidad++;
        }
        
        actualizarCarrito();
    });
});

// Función para manejar el aumento y disminución de la cantidad en el carrito
carritoLista.addEventListener('click', (e) => {
    if (e.target.classList.contains('sumar-btn')) {
        const id = e.target.getAttribute('data-id');
        if (carrito[id]) {
            carrito[id].cantidad++;
            actualizarCarrito();
        }
    } else if (e.target.classList.contains('restar-btn')) {
        const id = e.target.getAttribute('data-id');
        if (carrito[id]) {
            carrito[id].cantidad--;
            if (carrito[id].cantidad <= 0) {
                delete carrito[id];
            }
            actualizarCarrito();
        }
    }
});

// Mostrar carrito cuando se hace clic en el ícono del carrito
document.querySelector('.carrito').addEventListener('click', (e) => {
    e.preventDefault();
    mostrarCarrito();
});

// Manejar el redireccionamiento al pagar
document.querySelector('.carrito-pagar').addEventListener('click', (e) => {
    if (Object.keys(carrito).length === 0) {
        e.preventDefault();
        alert('El carrito está vacío.');
    }
});