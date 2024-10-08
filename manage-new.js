const API_URL = 'https://pj4ld9fn-8080.brs.devtunnels.ms/api';
let cachedNews = null;
let newsPerPage = 10; 

function showLoadingIndicator() {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = '<tr><td colspan="5">Cargando noticias...</td></tr>';
}

function hideLoadingIndicator() {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = '';
}

async function loadNews() {
    if (cachedNews) {
        filterAndDisplayNews(cachedNews); 
        return;
    }

    showLoadingIndicator();

    try {
        const response = await fetch(`${API_URL}/noticias`);
        if (!response.ok) {
            throw new Error('Error al obtener las noticias');
        }
        cachedNews = await response.json(); 
        console.log('Noticias cargadas:', cachedNews);
        filterAndDisplayNews(cachedNews);
    } catch (error) {
        console.error('Error al cargar las noticias:', error);
        hideLoadingIndicator();
    }
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function filterAndDisplayNews(news, page = 1) {
    const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const selectedDateOrder = document.getElementById('filterDate')?.value || 'none';

    let filteredNews = [...news];

    if (searchQuery) {
        filteredNews = filteredNews.filter(item => item.title.toLowerCase().includes(searchQuery));
    }

    if (selectedDateOrder === 'dateDesc') {
        filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date)); 
    } else if (selectedDateOrder === 'dateAsc') {
        filteredNews.sort((a, b) => new Date(a.date) - new Date(b.date)); 
    }

    const totalPages = Math.ceil(filteredNews.length / newsPerPage);
    const paginatedNews = filteredNews.slice((page - 1) * newsPerPage, page * newsPerPage);

    requestAnimationFrame(() => displayNews(paginatedNews));
    updatePaginationControls(totalPages, page);
}


function displayNews(news) {
    const tableBody = document.querySelector('table tbody');
    if (!tableBody) {
        console.error('No se encontró el cuerpo de la tabla');
        return;
    }

    const fragment = document.createDocumentFragment();

    if (news.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No se encontraron noticias</td></tr>';
        return;
    }

    news.forEach(item => {
        if (item.status === 'Visible') {
            const row = document.createElement('tr');
            row.innerHTML = `
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
            `;
            fragment.appendChild(row);
        }
    });
    tableBody.innerHTML = ''; 
    tableBody.appendChild(fragment);
}

function updatePaginationControls(totalPages, currentPage) {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.disabled = i === currentPage;
        pageBtn.addEventListener('click', () => filterAndDisplayNews(cachedNews, i));
        paginationControls.appendChild(pageBtn);
    }
}

async function deleteNews(id) {
    try {
        const response = await fetch(`${API_URL}/noticias/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener la noticia');
        }
        const newsItem = await response.json();

        console.log('Actualizando status de la noticia:', id);
        
        const updateResponse = await fetch(`${API_URL}/noticias/status/${id}?status=Invisible`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (updateResponse.ok) {
            console.log('Status actualizado exitosamente');

            cachedNews = cachedNews.map(item => (item.id === id ? { ...item, status: 'Invisible' } : item));

            loadNews(); 
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
            body: newsData,
        });

        if (response.ok) {
            showCreationDialog();
        } else {
            alert('Error al crear la noticia');
        }
    } catch (error) {
        console.error('Error al conectarse la noticia:', error);
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
    const previewImage = document.getElementById('preview');

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
                date
            };

            const formData = new FormData();
            formData.append('noticia', new Blob([JSON.stringify(newsData)], { type: 'application/json' }));
            if (img) {
                formData.append('file', img);
            }

            createNews(formData);
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

    const returnBtn = document.getElementById('returnBtn');
    
    if (returnBtn) {
        returnBtn.addEventListener('click', function() {
            window.location.href = 'manage-news.html';  
        });
    }


    loadNews();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => filterAndDisplayNews(cachedNews)); 
    }

    const filterCategory = document.getElementById('filterCategory');
    if (filterCategory) {
        filterCategory.addEventListener('change', loadNews); 
    }

    const filterDate = document.getElementById('filterDate');
    if (filterDate) {
        filterDate.addEventListener('change', () => filterAndDisplayNews(cachedNews)); 
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