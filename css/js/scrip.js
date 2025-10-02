// Guardar pedido en localStorage
function guardarPedido(pedido) {
  let pedidos = JSON.parse(localStorage.getItem("pedidosPast")) || [];
  pedidos.push(pedido);
  localStorage.setItem("pedidosPast", JSON.stringify(pedidos));
}

// Cargar pedidos desde localStorage
function cargarPedidos() {
  return JSON.parse(localStorage.getItem("pedidosPast")) || [];
}

// ========================
// Pedido.html (Formulario)
// ========================

function calcularTotal() {
  const producto = document.getElementById("producto").value;
  const tamano = document.querySelector("input[name='tamano']:checked");
  const extrasSeleccionados = document.querySelectorAll("input[type='checkbox']:checked");

  if (!producto || !tamano) {
    alert("Seleccione producto y tamaño.");
    return;
  }

  let base = 0;
  // precios por tamaño 
  if (producto === "Torta de Chocolate") {
    base = tamano.value == 0.5 ? 40 : tamano.value == 1 ? 70 : 120;
  } else if (producto === "Torta de Fresas") {
    base = tamano.value == 0.5 ? 45 : tamano.value == 1 ? 80 : 130;
  } else if (producto === "Cheesecake") {
    base = tamano.value == 0.5 ? 50 : tamano.value == 1 ? 90 : 150;
  }

  let extras = [];
  let extraCosto = 0;
  extrasSeleccionados.forEach(e => {
    extras.push(e.value);
    if (e.value === "Fresas") extraCosto += 5;
    if (e.value === "Chocolate") extraCosto += 5;
    if (e.value === "Fondant") extraCosto += 8;
  });

  const total = base + extraCosto;

  // Mostrar ticket
  const ticket = document.getElementById("ticket");
  ticket.innerHTML = `
    <p><strong>Producto:</strong> ${producto}</p>
    <p><strong>Tamaño:</strong> ${tamano.value} kg</p>
    <p><strong>Extras:</strong> ${extras.length ? extras.join(", ") : "Ninguno"}</p>
    <p class="fw-bold">Total: S/ ${total}</p>
  `;

  return total;
}

// Manejo de formulario
const formPedido = document.getElementById("formPedido");
if (formPedido) {
  // Fecha mínima = hoy + 2
  const fechaInput = document.getElementById("fecha");
  if (fechaInput) {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 2);
    fechaInput.min = hoy.toISOString().split("T")[0];
  }

  formPedido.addEventListener("submit", function (e) {
    e.preventDefault();

    const cliente = document.getElementById("cliente").value;
    const telefono = document.getElementById("telefono").value;
    const producto = document.getElementById("producto").value;
    const tamano = document.querySelector("input[name='tamano']:checked").value;
    const mensaje = document.getElementById("mensaje").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    const extrasSeleccionados = document.querySelectorAll("input[type='checkbox']:checked");
    let extras = [];
    extrasSeleccionados.forEach(e => extras.push(e.value));

    const total = calcularTotal();

    const pedido = {
      cliente,
      telefono,
      producto,
      tamano,
      mensaje,
      extras,
      fecha,
      hora,
      total,
      estado: "Preparación"
    };

    guardarPedido(pedido);
    alert("✅ Pedido guardado con éxito.");
    formPedido.reset();
    document.getElementById("ticket").innerHTML = "<p><em>Pedido registrado. Vea la lista en 'Ver Pedidos'.</em></p>";
  });
}

// ========================
// Pedidos
// ========================

function mostrarPedidos() {
  const tabla = document.getElementById("tablaPedidos");
  if (!tabla) return;

  let pedidos = cargarPedidos();
  tabla.innerHTML = "";

  pedidos.forEach((p, i) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.cliente}</td>
      <td>${p.producto}</td>
      <td>${p.tamano} kg</td>
      <td>${p.extras.length ? p.extras.join(", ") : "Ninguno"}</td>
      <td>${p.fecha} ${p.hora}</td>
      <td>S/ ${p.total}</td>
      <td><span class="badge ${p.estado === "Entregado" ? "bg-success" : "bg-warning"}">${p.estado}</span></td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="cambiarEstado(${i})">Marcar Entregado</button>
        <button class="btn btn-sm btn-dark" onclick="imprimirTicket(${i})">Imprimir</button>
      </td>
    `;

    tabla.appendChild(fila);
  });
}

function cambiarEstado(index) {
  let pedidos = cargarPedidos();
  pedidos[index].estado = "Entregado";
  localStorage.setItem("pedidosPast", JSON.stringify(pedidos));
  mostrarPedidos();
}

function imprimirTicket(index) {
  let pedidos = cargarPedidos();
  const p = pedidos[index];
  const ventana = window.open("", "PRINT", "height=600,width=800");

  ventana.document.write(`
    <h2>🍰 Dulce Sabor</h2>
    <p><strong>Cliente:</strong> ${p.cliente}</p>
    <p><strong>Producto:</strong> ${p.producto}</p>
    <p><strong>Tamaño:</strong> ${p.tamano} kg</p>
    <p><strong>Extras:</strong> ${p.extras.length ? p.extras.join(", ") : "Ninguno"}</p>
    <p><strong>Mensaje:</strong> ${p.mensaje || "Ninguno"}</p>
    <p><strong>Entrega:</strong> ${p.fecha} ${p.hora}</p>
    <p class="fw-bold">Total: S/ ${p.total}</p>
    <p><em>Estado: ${p.estado}</em></p>
    <hr>
    <p>¡Gracias por su compra! 🧁</p>
  `);

  ventana.document.close();
  ventana.print();
}

// ========================
// Inicialización
// ========================
document.addEventListener("DOMContentLoaded", () => {
  mostrarPedidos();
});

