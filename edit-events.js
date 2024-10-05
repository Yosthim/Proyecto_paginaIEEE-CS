const API_URL = 'https://pj4ld9fn-8080.brs.devtunnels.ms/api';

async function loadEventForEdit(id) {
    try {
        console.log("Loading event with ID:", id); 
        const response = await fetch(`${API_URL}/eventos/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener el evento');
        }
        const event = await response.json();
        event.id = event.id || id;
        populateEditForm(event);
    } catch (error) {
        console.error('Error al cargar el evento para editar:', error);
    }
}

function populateEditForm(event) {
    console.log("Populating form with event data:", event); 
    const eventIdField = document.getElementById('eventId');
    const titleField = document.getElementById('title');
    const categoryField = document.getElementById('category');
    const dateField = document.getElementById('date');
    const timeField = document.getElementById('time');
    const locationField = document.getElementById('location');
    const descriptionField = document.getElementById('content');
    const previewImage = document.getElementById('previewImage');

    if (eventIdField) eventIdField.value = event.id || '';  
    if (titleField) titleField.value = event.title || '';
    if (categoryField) categoryField.value = event.category || '';
    if (dateField) dateField.value = event.date || '';
    if (timeField) timeField.value = event.time || '';
    if (locationField) locationField.value = event.location || '';
    if (descriptionField) descriptionField.value = event.description || '';

    if (event.img && previewImage) {
        previewImage.src = `${API_URL}/eventos/${event.id}/${event.img}`;  
        previewImage.style.display = 'block';
    } else if (previewImage) {
        previewImage.style.display = 'none';
    }
}

async function updateEvent(eventData) {
    try {
        console.log("Attempting to update event with data:", eventData); 
        const response = await fetch(`${API_URL}/eventos/${eventData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });
        if (response.ok) {
            showEditConfirmationModal();
        } else {
            throw new Error('Error al actualizar el evento');
        }
    } catch (error) {
        console.error('Error al actualizar el evento:', error);
        alert('No se pudo actualizar el evento. Por favor, intenta de nuevo más tarde.');
    }
}

function showEditConfirmationModal() {
    const editModal = document.getElementById('edit-modal');
    if (editModal) {
        editModal.style.display = 'flex';

        document.getElementById('acceptEditBtn').addEventListener('click', () => {
            editModal.style.display = 'none';
            window.location.href = 'manage-events.html';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (eventId) {
        console.log("Event ID from URL:", eventId); 
        loadEventForEdit(eventId);
    } else {
        console.error("No event ID found in URL!"); 
    }


    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('title')?.value;
            const category = document.getElementById('category')?.value;
            const date = document.getElementById('date')?.value;
            const time = document.getElementById('time')?.value;
            const location = document.getElementById('location')?.value;
            const description = document.getElementById('content')?.value;
            const img = document.getElementById('image')?.files[0];
            const originalImg = document.getElementById('previewImage')?.src.split('/').pop();  

            const eventData = {
                id: document.getElementById('eventId')?.value,
                title,
                category,
                date,
                time,
                location,
                description,
                img: img ? img.name : originalImg,  
            };

            if (!eventData.id) {
                console.error('No ID found for event update!'); 
                alert('No se pudo obtener el ID del evento.');
                return;
            }

            updateEvent(eventData);
        });
    }

    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function () {
            document.getElementById('image')?.click();
        });
    }
});
