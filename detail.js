const API_BASE_URL = 'http://localhost:8080/api/noticias';

function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

function renderNewsDetail(news) {
    const container = document.getElementById('news-detail');
    container.innerHTML = `
        <div class="new">
            <h2>${news.title}</h2>
            <div class="new-header flex space-between black">
                <h3>${news.source}</h3>
                <h3>${news.date}</h3>
            </div>
            <hr>
            <div class="new-body black">
                <p>${news.content}</p>
                <img class="new-image" src="${news.img}" alt="${news.title}">
            </div>
        </div>
    `;
}

function showLoading() {
    document.getElementById('news-detail').innerHTML = '<p class="loading-message">Cargando noticia...</p>';
}

function renderError() {
    document.getElementById('news-detail').innerHTML = '<p class="error-message">No se pudo cargar la noticia.</p>';
}

async function fetchNewsDetail(id) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error('Error en la solicitud');
        const news = await response.json();
        renderNewsDetail(news);
    } catch (error) {
        console.error(error);
        renderError();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const newsId = getQueryParam('id');
    if (newsId) {
        fetchNewsDetail(newsId);
    } else {
        renderError();
    }
});
