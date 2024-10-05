const API_URL = 'https://pj4ld9fn-8080.brs.devtunnels.ms/api';

async function loadNewsForEdit(id) {
    try {
        console.log("Loading news with ID:", id); 
        const response = await fetch(`${API_URL}/noticias/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener la noticia');
        }
        const news = await response.json();
        news.id = news.id || id;
        populateEditForm(news);
    } catch (error) {
        console.error('Error al cargar la noticia para editar:', error);
    }
}

function populateEditForm(news) {
    console.log("Populating form with news data:", news); 
    const newsIdField = document.getElementById('newsId');
    const titleField = document.getElementById('title');
    const categoryField = document.getElementById('category');
    const autorField = document.getElementById('autor');
    const sourceField = document.getElementById('source');
    const contentField = document.getElementById('content');
    const previewImage = document.getElementById('previewImage');

    if (newsIdField) newsIdField.value = news.id || '';  
    if (titleField) titleField.value = news.title || '';
    if (categoryField) categoryField.value = news.category || '';
    if (autorField) autorField.value = news.autor || '';
    if (sourceField) sourceField.value = news.source || '';
    if (contentField) contentField.value = news.content || '';

    if (news.img && previewImage) {
        previewImage.src = `${API_URL}/noticias/${news.id}/${news.img}`;  
        previewImage.style.display = 'block';
    } else if (previewImage) {
        previewImage.style.display = 'none';
    }
}

async function updateNews(newsData) {
    try {
        console.log("Attempting to update news with data:", newsData); 
        const response = await fetch(`${API_URL}/noticias/${newsData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newsData),
        });
        if (response.ok) {
            showEditConfirmationModal();
        } else {
            throw new Error('Error al actualizar la noticia');
        }
    } catch (error) {
        console.error('Error al actualizar la noticia:', error);
        alert('No se pudo actualizar la noticia. Por favor, intenta de nuevo más tarde.');
    }
}

function showEditConfirmationModal() {
    const editModal = document.getElementById('edit-modal');
    if (editModal) {
        editModal.style.display = 'flex';

        document.getElementById('acceptEditBtn').addEventListener('click', () => {
            editModal.style.display = 'none';
            window.location.href = 'manage-news.html';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');
    
    if (newsId) {
        console.log("News ID from URL:", newsId); 
        loadNewsForEdit(newsId);
    } else {
        console.error("No news ID found in URL!"); 
    }


    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('title')?.value;
            const category = document.getElementById('category')?.value;
            const autor = document.getElementById('autor')?.value;
            const source = document.getElementById('source')?.value;
            const content = document.getElementById('content')?.value;
            const img = document.getElementById('image')?.files[0];
            const originalImg = document.getElementById('previewImage')?.src.split('/').pop();  
            const date = document.getElementById('newsId').dataset.date || '';  

            const newsData = {
                id: document.getElementById('newsId')?.value,
                title,
                category,
                autor,
                source,
                content,
                img: img ? img.name : originalImg,  
                date: date || new Date().toISOString(),  
            };

            if (!newsData.id) {
                console.error('No ID found for news update!'); 
                alert('No se pudo obtener el ID de la noticia.');
                return;
            }

            updateNews(newsData);
        });
    }

    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function () {
            document.getElementById('image')?.click();
        });
    }
});