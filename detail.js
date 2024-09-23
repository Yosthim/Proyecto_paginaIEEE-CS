function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener('DOMContentLoaded', async () => {
    const newsId = getQueryParam('id'); 

    if (!newsId || isNaN(newsId)) {
        console.error('El ID de la noticia no está definido o es inválido.');
        document.getElementById('news-detail').innerHTML = '<p>Error: ID de noticia inválido.</p>';
        return;
    }

    try {
        const API_BASE_URL = `https://pj4ld9fn-8080.brs.devtunnels.ms/api/noticias/${newsId}`;
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) throw new Error(`Error al obtener la noticia: ${response.statusText}`);

        const newsData = await response.json(); 
        renderNewsDetail(newsData); 
        renderComments(newsData.comment); 
    } catch (error) {
        console.error(error);
        document.getElementById('news-detail').innerHTML = '<p>Error al cargar la noticia.</p>';
    }

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

function renderNewsDetail(news) {
    const detailContainer = document.getElementById('news-detail');
    detailContainer.innerHTML = `
        <div class="new">
            <div class="principal-title flex">
                <h2>${news.title}</h2>
            </div>
            <div class="new-content flex">
                <div class="new-header flex black space-between">
                    <h3>${news.tema}</h3>
                    <h3>${news.date}</h3>
                </div>
                <hr></hr>
                <div class="new-body black flex">
                    <p>${news.source}</p>
                    <div>
                        <h3 class="section-title text-left">${news.details}</h3>
                        <p>${news.detailsContent}</p>
                    </div>         
                    <div>             
                        <h3 class="section-title text-left">${news.aditional}</h3>
                        <p>${news.contextAditional}</p>                        
                    </div>
                    <img class="new-image" src="${news.img}" alt="${news.title}">
                </div>
                <hr>
                <p class="source"><b>Fuente:</b> ${news.sourceLink}</p>
            </div>
        </div>
    `;
}


function renderComments(comments) {
    const commentsContainer = document.getElementById('comments-list');

    if (!comments || comments.length === 0) {
        commentsContainer.innerHTML = '<p>No hay comentarios disponibles.</p>';
        return;
    }

    comments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.classList.add('comment');
        commentItem.innerHTML = `
            <img src="/images/user1.png" alt="User Avatar">
            <p class="comment-content"><strong>${comment.name}:</strong> ${comment.source}</p>
        `;
        commentsContainer.appendChild(commentItem);
    });
}

function addComment(event) {
    event.preventDefault(); 
    const commentText = document.getElementById('comment-text').value; 
    const commentItem = document.createElement('div');
    commentItem.classList.add('comment');
    
    commentItem.innerHTML = `
        <img src="/images/user1.png" alt="User Avatar">
        <p class="comment-content"><strong>${comment}:</strong> ${commentText}</p>
    `;
    
    const commentsList = document.getElementById('comments-list');
    commentsList.appendChild(commentItem);
    
    document.getElementById('comment-text').value = '';
}
