const API_URL = 'https://pj4ld9fn-8080.brs.devtunnels.ms/api';

async function loadEvents(filter = '') {
    try {
        const response = await fetch(`${API_URL}/eventos${filter}`);
        if (!response.ok) {
            throw new Error('Error al obtener los eventos');
        }
        const events = await response.json();
        console.log('Eventos cargados:', events);
        displayEvents(events);
    } catch (error) {
        console.error('Error al cargar los eventos:', error);
    }
}

function displayEvents(events) {
    const tableBody = document.querySelector('table tbody');
    if (!tableBody) {
        console.error('No se encontró el cuerpo de la tabla');
        return;
    }
    tableBody.innerHTML = '';
    events.forEach(item => {
        if (item.status === 'Visible') {
            const row = `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.date}</td>
                    <td>${item.category}</td>
                    <td>${item.title}</td>
                    <td>${item.location}</td>
                    <td>    
                        <a href="modify-event.html?id=${item.id}" class="edit">
                            <i class="material-symbols-outlined">edit</i>
                        </a>
                        <a href="view-event.html?id=${item.id}" class="view" data-id="${item.id}">
                            <i class="material-symbols-outlined">visibility</i>
                        </a>
                        <a href="#" class="delete" data-id="${item.id}" data-title="${item.title}">
                            <i class="material-symbols-outlined">delete</i>
                        </a>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        }
    });
}

async function deleteEvent(id) {
    try {
        const response = await fetch(`${API_URL}/eventos/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener el evento');
        }
        const eventItem = await response.json();

        console.log('Actualizando status del evento:', id);
        console.log('Status actual:', eventItem.status);
        
        const updateResponse = await fetch(`${API_URL}/eventos/status/${id}?status=Invisible`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (updateResponse.ok) {
            console.log('Status actualizado exitosamente');
            
            const verificationResponse = await fetch(`${API_URL}/eventos/${id}`);
            if (verificationResponse.ok) {
                const updatedItem = await verificationResponse.json();
                console.log('Estado después de la actualización:', updatedItem);
                
                if (updatedItem.status === 'Invisible') {
                    console.log('Actualización confirmada');
                    loadEvents();  
                } else {
                    console.error('La actualización del status no se reflejó correctamente');
                }
            }
        } else {
            const errorText = await updateResponse.text();
            console.error('Error Response:', errorText);
            throw new Error(`Error al actualizar el estado del evento: ${updateResponse.status}`);
        }
    } catch (error) {
        console.error('Error al cambiar el estado del evento:', error.message);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

function showDeleteConfirmationModal(id, title) {
    const modal = document.getElementById('delete-confirmation-modal');
    const modalText = document.getElementById('delete-confirmation-text');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    modalText.textContent = `¿Desea eliminar el evento "${title}"?`;
    modal.style.display = 'flex';

    confirmDeleteBtn.onclick = () => {
        deleteEvent(id);
        modal.style.display = 'none';
    };

    cancelDeleteBtn.onclick = () => {
        modal.style.display = 'none';
    };
}

async function createEvent(eventData) {
    try {
        const response = await fetch(`${API_URL}/eventos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });
        if (response.ok) {
            showCreationDialog();
        } else {
            alert('Error al crear el evento');
        }
    } catch (error) {
        console.error('Error al crear el evento:', error);
    }
}

function showCreationDialog() {
    const creationModal = document.getElementById('creation-modal');
    if (creationModal) {
        creationModal.style.display = 'flex';

        const acceptCreationBtn = document.getElementById('acceptCreationBtn');
        if (acceptCreationBtn) {
            acceptCreationBtn.addEventListener('click', () => {
                creationModal.style.display = 'none';
                window.location.href = 'manage-events.html';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const title = document.getElementById('title')?.value;
            const category = document.getElementById('category')?.value;
            const date = document.getElementById('date')?.value;
            const time = document.getElementById('time')?.value;
            const location = document.getElementById('location')?.value;
            const description = document.getElementById('content')?.value;
            const img = document.getElementById('image')?.files[0];

            const eventData = {
                title,
                category,
                date,
                time,
                location,
                description,
                img: img ? img.name : ''
            };

            createEvent(eventData);
        });
    }
    
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function () {
            document.getElementById('image')?.click();
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadEvents();

    const filterSelect = document.getElementById('filt');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            const filter = `?filter=${filterSelect.value}`;
            loadEvents(filter);
        });
    }

    const table = document.querySelector('table');
    if (table) {
        table.addEventListener('click', (e) => {
            const target = e.target.closest('a');
            if (!target) return;

            if (target.classList.contains('edit')) {
                return;
            }

            if (target.classList.contains('view')) {
                return;
            }

            e.preventDefault();
            const id = target.dataset.id;

            if (target.classList.contains('delete')) {
                const title = target.dataset.title;
                showDeleteConfirmationModal(id, title);
            } 
        });
    }
});
