// Definimos las rutas de las APIs para eventos actuales y pasados
const API_EVENTOS_ACTUALES = 'http://localhost:3001/eventos/actuales';
const API_EVENTOS_PASADOS = 'http://localhost:3001/eventos/pasados';

// Función para renderizar los eventos en el HTML
function renderEvents(eventData, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Limpiar el contenedor antes de añadir las nuevas tarjetas

    eventData.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.classList.add('card');
        eventItem.style.backgroundImage = `url(${event.img})`; // Añadir la imagen de fondo
        eventItem.innerHTML = `
            <div class="text-container">
                <h2>${event.title}</h2>
                <p><strong>FECHA:</strong> ${event.date}</p>
                <p><strong>HORA:</strong> ${event.time}</p>
                <p><strong>PLATAFORMA:</strong> ${event.platform}</p>
            </div>
            <div class="button-container">
                <a href="detail.html?id=${event.id}" class="btn">Suscribirse</a>
            </div>
        `;
        container.appendChild(eventItem); // Añadir cada tarjeta al contenedor
    });
}

// Función que muestra el mensaje de "Cargando..."
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p class="loading-message">Cargando eventos...</p>';
}

// Función que muestra el mensaje de error si no se pueden cargar los eventos
function renderError(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p class="error-message">Error al cargar los eventos.</p>';
}

// Función que hace la solicitud a la API y maneja la respuesta
async function fetchEvents(apiUrl, containerId) {
    try {
        showLoading(containerId); // Mostrar mensaje de "Cargando..."
        const response = await fetch(apiUrl); // Hacer la solicitud a la API
        if (!response.ok) throw new Error('Error en la solicitud');
        const data = await response.json(); // Convertir la respuesta en JSON
        renderEvents(data, containerId); // Renderizar los eventos en el contenedor
    } catch (error) {
        console.error(error);
        renderError(containerId); // Mostrar mensaje de error en caso de fallo
    }
}

// Función principal que se ejecuta cuando la página carga
document.addEventListener('DOMContentLoaded', () => {
    fetchEvents(API_EVENTOS_ACTUALES, 'current-events'); // Cargar eventos actuales
    fetchEvents(API_EVENTOS_PASADOS, 'past-events');     // Cargar eventos pasados
});
