const API_NOVEDADES = 'http://localhost:8080/api/noticias/novedades';
const API_TECNOLOGIA = 'http://localhost:8080/api/noticias/tecnologia';

function renderNews(newsData, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    newsData.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('grid-item');
        newsItem.innerHTML = `
            <img src="${news.img}" alt="${news.title}" width="300" height="200">
            <div class="text">
                <h4>${news.title}</h4>
                <div class="flex space-between">
                    <a href="detail.html?id=${news.id}" class="btn">Leer más</a>
                    <p class="date">${news.date}</p>
                </div>
            </div>
        `;
        container.appendChild(newsItem);
    });
}

function showLoading(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p class="loading-message">Cargando noticias...</p>';
}

function renderError(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p class="error-message">Error al cargar las noticias.</p>';
}

async function fetchNews(apiUrl, containerId) {
    try {
        showLoading(containerId);
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error en la solicitud');
        const data = await response.json();
        renderNews(data, containerId);
    } catch (error) {
        console.error(error);
        renderError(containerId);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchNews(API_NOVEDADES, 'news-container');
    fetchNews(API_TECNOLOGIA, 'tech-container');
});
