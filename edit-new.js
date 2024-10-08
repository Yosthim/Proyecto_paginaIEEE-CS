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
        requestAnimationFrame(() => populateEditForm(news));
    } catch (error) {
        console.error('Error al cargar la noticia para editar:', error);
    }
}

function populateEditForm(news) {
    console.log("Populating form with news data:", news);

    const fields = {
        newsId: document.getElementById('newsId'),
        title: document.getElementById('title'),
        category: document.getElementById('category'),
        autor: document.getElementById('autor'),
        source: document.getElementById('source'),
        content: document.getElementById('content'),
        previewImage: document.getElementById('previewImage'), 
        imageInput: document.getElementById('image')  
    };

    fields.newsId.value = news.id || '';  
    fields.title.value = news.title || '';
    fields.category.value = news.category || '';
    fields.autor.value = news.autor || '';
    fields.source.value = news.source || '';
    fields.content.value = news.content || '';

    if (news.img && fields.previewImage) {
        fields.previewImage.src = news.img; 
        fields.previewImage.style.display = 'block'; 
        fields.imageInput.dataset.originalImg = news.img;  
    } else if (fields.previewImage) {
        fields.previewImage.style.display = 'none';  
        fields.imageInput.dataset.originalImg = ''; 
    }

    fields.imageInput.addEventListener('change', () => {
        const file = fields.imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                fields.previewImage.src = e.target.result;
                fields.previewImage.style.display = 'block'; 
            };
            reader.readAsDataURL(file);
        }
    });
}

async function updateNews(newsId, newsData) {
    try {
        console.log("Attempting to update news with ID:", newsId);

        const response = await fetch(`${API_URL}/noticias/${newsId}`, {
            method: 'PUT',
            body: newsData,
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
    const returnBtn = document.getElementById('returnBtn');
    
    if (returnBtn) {
        returnBtn.addEventListener('click', function() {
            window.location.href = 'manage-news.html';
        });
    }

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
            const imgInput = document.getElementById('image');
            const newImg = imgInput?.files[0];
            const originalImg = imgInput?.dataset.originalImg; 
            const date = document.getElementById('newsId').dataset.date || '';  

            const newsData = {
                id: document.getElementById('newsId')?.value,
                title,
                category,
                autor,
                source,
                content,  
                date: date || new Date().toISOString(),  
            };

            const formData = new FormData();
            formData.append('noticia', new Blob([JSON.stringify(newsData)], { type: 'application/json' }));

            if (newImg) {
                formData.append('file', newImg);  
            } else if (originalImg) {
                formData.append('file', new Blob([JSON.stringify({ img: originalImg })], { type: 'application/json' }));
            } else {
                formData.append('file', new Blob([''], { type: 'text/plain' })); 
            }

            if (!newsData.id) {
                console.error('No ID found for news update!'); 
                alert('No se pudo obtener el ID de la noticia.');
                return;
            }

            updateNews(newsData.id, formData);
        });
    }

    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function () {
            document.getElementById('image')?.click();
        });
    }
});
