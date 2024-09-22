const API_EVENTOS_ACTUALES = 'http://localhost:3001/eventos/actuales';
const API_EVENTOS_PASADOS = 'http://localhost:3001/eventos/pasados';

function renderEvents(eventData, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    eventData.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.classList.add('card');
        eventItem.style.backgroundImage = `url(${event.img})`;
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
        container.appendChild(eventItem);
    });

    addSubscriptionListeners();
}

function showLoading(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p class="loading-message">Cargando eventos...</p>';
}

function renderError(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p class="error-message">Error al cargar los eventos.</p>';
}

async function fetchEvents(apiUrl, containerId) {
    try {
        showLoading(containerId);
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error en la solicitud');
        const data = await response.json();
        renderEvents(data, containerId);
    } catch (error) {
        console.error(error);
        renderError(containerId);
    }
}

function addSubscriptionListeners() {
    const subscribeButtons = document.querySelectorAll('.btn');
    subscribeButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const eventId = this.getAttribute('href').split('=')[1];
            subscribeToEvent(eventId);
        });
    });
}

function subscribeToEvent(eventId) {
    alert(`Te has suscrito al evento con ID: ${eventId}`);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchEvents(API_EVENTOS_ACTUALES, 'current-events');
    fetchEvents(API_EVENTOS_PASADOS, 'past-events');
});
