const API_URL = 'https://pj4ld9fn-8080.brs.devtunnels.ms/api/noticias';

function renderNews(newsData, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 

    newsData.forEach(async(news, index) => {
        const newsItem = document.createElement('div');
        const newsId = news.id;

        const specificContent = await fetchSpecificContent(newsId);


        if (index === 0 && containerId === 'news-container') {
            newsItem.classList.add('grid-item', 'large-item');
            newsItem.innerHTML = `
                <img src="${getImageUrl(news.img)}" alt="${news.title}">
                <div class="text">
                    <h4>${news.title}</h4>
                    <p>${specificContent ? specificContent.content : news.content}</p>  
                    <div class="flex space-between">
                        <a href="index2.html?id=${newsId}" class="btn">Leer más</a>
                        <p class="date">${news.date || 'Fecha no disponible'}</p>
                    </div>
                </div>
            `;
        } else {
            newsItem.classList.add('grid-item');
            newsItem.innerHTML = `
                <img src="${getImageUrl(news.img)}" alt="${news.title}" width="300" height="200">
                <div class="text">
                    <h4>${news.title}</h4>
                    <div class="flex space-between">
                        <a href="index2.html?id=${newsId}" class="btn">Leer más</a>
                        <p class="date">${news.date || 'Fecha no disponible'}</p>
                    </div>
                </div>
            `;
        }

        container.appendChild(newsItem);
    });
}

async function fetchSpecificContent(newsId) {
    try {
        const response = await fetch(`https://pj4ld9fn-8080.brs.devtunnels.ms/api/noticias/${newsId}`);
        if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
        
        const specificNews = await response.json();
        return specificNews; 
    } catch (error) {
        console.error('Error al obtener contenido específico:', error);
        return null;
    }
}

function getImageUrl(imgPath) {
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
        return imgPath;
    }
    return `https://pj4ld9fn-8080.brs.devtunnels.ms/images/${imgPath}`;
}

function showLoading(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p class="loading-message">Cargando noticias...</p>';
}

function renderError(containerId, errorMessage) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<p class="error-message">Error al cargar las noticias: ${errorMessage}</p>`;
}

async function fetchNews(apiUrl, containerId, filterType = 'all') {
    try {
        showLoading(containerId);
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        let data = await response.json();
        console.log('Datos recibidos:', data);

        if (!Array.isArray(data)) {
            throw new Error('Los datos recibidos no son un array de noticias');
        }

        if (filterType === 'latest') {
            data = data.slice(0, 4);  
        }

        renderNews(data, containerId);
    } catch (error) {
        console.error('Error en fetchNews:', error);
        renderError(containerId, error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchNews(API_URL, 'news-container', 'latest');
    fetchNews(API_URL, 'tech-container', 'all');

    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});