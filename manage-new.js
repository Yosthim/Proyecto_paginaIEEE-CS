const API_URL = 'https://pj4ld9fn-8080.brs.devtunnels.ms/api';

async function loadNews(filter = '') {
    try {
        const response = await fetch(`${API_URL}/noticias${filter}`);
        if (!response.ok) {
            throw new Error('Error al obtener las noticias');
        }
        const news = await response.json();
        console.log('Noticias cargadas:', news);
        displayNews(news);
    } catch (error) {
        console.error('Error al cargar las noticias:', error);
    }
}

function displayNews(news) {
    const tableBody = document.querySelector('table tbody');
    if (!tableBody) {
        console.error('No se encontró el cuerpo de la tabla');
        return;
    }
    tableBody.innerHTML = '';
    news.forEach(item => {
        if (item.status === 'Visible') {
            const row = `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.date}</td>
                    <td>${item.category}</td>
                    <td>${item.title}</td>
                    <td>    
                        <a href="modify-new.html?id=${item.id}" class="edit">
                            <i class="material-symbols-outlined">edit</i>
                        </a>
                        <a href="view-new.html?id=${item.id}" class="view" data-id="${item.id}">
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

async function deleteNews(id) {
    try {
        const response = await fetch(`${API_URL}/noticias/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener la noticia');
        }
        const newsItem = await response.json();

        console.log('Actualizando status de la noticia:', id);
        console.log('Status actual:', newsItem.status);
        
        const updateResponse = await fetch(`${API_URL}/noticias/status/${id}?status=Invisible`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (updateResponse.ok) {
            console.log('Status actualizado exitosamente');
            
            const verificationResponse = await fetch(`${API_URL}/noticias/${id}`);
            if (verificationResponse.ok) {
                const updatedItem = await verificationResponse.json();
                console.log('Estado después de la actualización:', updatedItem);
                
                if (updatedItem.status === 'Invisible') {
                    console.log('Actualización confirmada');
                    loadNews();  
                } else {
                    console.error('La actualización del status no se reflejó correctamente');
                }
            }
        } else {
            const errorText = await updateResponse.text();
            console.error('Error Response:', errorText);
            throw new Error(`Error al actualizar el estado de la noticia: ${updateResponse.status}`);
        }
    } catch (error) {
        console.error('Error al cambiar el estado de la noticia:', error.message);
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

    modalText.textContent = `¿Desea eliminar la noticia "${title}"?`;
    modal.style.display = 'flex';

    confirmDeleteBtn.onclick = () => {
        deleteNews(id);
        modal.style.display = 'none';
    };

    cancelDeleteBtn.onclick = () => {
        modal.style.display = 'none';
    };
}

async function createNews(newsData) {
    try {
        const response = await fetch(`${API_URL}/noticias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newsData),
        });
        if (response.ok) {
            showCreationDialog();
        } else {
            alert('Error al crear la noticia');
        }
    } catch (error) {
        console.error('Error al crear la noticia:', error);
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
                window.location.href = 'manage-news.html';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const newsForm = document.getElementById('newsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const title = document.getElementById('title')?.value;
            const category = document.getElementById('category')?.value;
            const autor = document.getElementById('autor')?.value;
            const source = document.getElementById('source')?.value;
            const content = document.getElementById('content')?.value;
            const img = document.getElementById('image')?.files[0];
            const date = new Date().toISOString();

            const newsData = {
                title,
                category,
                autor,
                source,
                content,
                img: img ? img.name : '',
                date
            };

            createNews(newsData);
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
    loadNews();

    const filterSelect = document.getElementById('filt');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            const filter = `?filter=${filterSelect.value}`;
            loadNews(filter);
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