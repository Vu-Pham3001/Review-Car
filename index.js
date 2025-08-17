var pageIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    initCarousels();
    getVideoAndImage();
    getData(pageIndex);
});

function initCarousels() {
    const videoContainer = document.getElementById('videoContainer');
    const videoPrev = document.getElementById('videoPrev');
    const videoNext = document.getElementById('videoNext');
    
    if (videoContainer && videoPrev && videoNext) {
        initCarousel(videoContainer, videoPrev, videoNext, 'video');
    }
    
    const imageContainer = document.getElementById('imageContainer');
    const imagePrev = document.getElementById('imagePrev');
    const imageNext = document.getElementById('imageNext');
    
    if (imageContainer && imagePrev && imageNext) {
        initCarousel(imageContainer, imagePrev, imageNext, 'image');
    }
}

function initCarousel(container, prevBtn, nextBtn, type) {
    let currentPosition = 0;
    let itemWidth = type === 'video' ? 275 : 220;
    
    function calculateItemWidth() {
        if (window.innerWidth <= 480) {
            return type === 'video' ? 275 : 220;
        } else if (window.innerWidth <= 768) {
            return type === 'video' ? 275 : 220;
        } else {
            return type === 'video' ? 275 : 220;
        }
    }
    
    function getVisibleItemsCount() {
        const containerWidth = container.offsetWidth;
        const calculatedItemWidth = calculateItemWidth();
        return Math.floor(containerWidth / calculatedItemWidth);
    }
    
    function updateButtons() {
        const containerWidth = container.offsetWidth;
        const totalWidth = container.scrollWidth;
        const maxScroll = Math.max(0, totalWidth - containerWidth);
        
        prevBtn.disabled = currentPosition <= 0;
        prevBtn.style.opacity = currentPosition <= 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentPosition <= 0 ? 'not-allowed' : 'pointer';
        
        nextBtn.disabled = currentPosition >= maxScroll;
        nextBtn.style.opacity = currentPosition >= maxScroll ? '0.5' : '1';
        nextBtn.style.cursor = currentPosition >= maxScroll ? 'not-allowed' : 'pointer';
    }
    
    function scrollTo(position) {
        const containerWidth = container.offsetWidth;
        const totalWidth = container.scrollWidth;
        const maxScroll = Math.max(0, totalWidth - containerWidth);
        
        currentPosition = Math.max(0, Math.min(position, maxScroll));
        container.style.transform = `translateX(-${currentPosition}px)`;
        
        updateButtons();
    }
    
    prevBtn.addEventListener('click', () => {
        if (prevBtn.disabled) return;
        
        const visibleItems = getVisibleItemsCount();
        const scrollAmount = visibleItems * itemWidth;
        const newPosition = currentPosition - scrollAmount;
        
        scrollTo(newPosition);
    });
    
    nextBtn.addEventListener('click', () => {
        if (nextBtn.disabled) return;
        
        const visibleItems = getVisibleItemsCount();
        const scrollAmount = visibleItems * itemWidth;
        const newPosition = currentPosition + scrollAmount;
        
        scrollTo(newPosition);
    });
    
    updateButtons();
    
    window.addEventListener('resize', () => {
        itemWidth = calculateItemWidth();
        
        const containerWidth = container.offsetWidth;
        const totalWidth = container.scrollWidth;
        const maxScroll = Math.max(0, totalWidth - containerWidth);
        
        if (currentPosition > maxScroll) {
            currentPosition = maxScroll;
        }
        
        container.style.transform = `translateX(-${currentPosition}px)`;
        updateButtons();
        
    });
    
    setTimeout(() => {
        updateButtons();
    }, 100);
}

function addTouchSupport(container, type) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        
        e.preventDefault();
    });
    
    container.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const diff = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                const nextBtn = container.parentElement.querySelector('.carousel-nav.next');
                if (nextBtn && !nextBtn.disabled) {
                    nextBtn.click();
                }
            } else {
                const prevBtn = container.parentElement.querySelector('.carousel-nav.prev');
                if (prevBtn && !prevBtn.disabled) {
                    prevBtn.click();
                }
            }
        }
        
        isDragging = false;
    });
}

function getVideoAndImage() {
    fetch(`http://103.159.51.69:3000/api/media/files`)
        .then(response => response.json())
        .then(data => {
            console.log('API data  video:', data);
        })
}

function getData(pageIndex) {
    fetch(`http://103.159.51.69:3000/api/reviews?pageIndex=${pageIndex}&pageSize=1`)
        .then(response => response.json())
        .then(data => {
            console.log('API data:', data);
            const reviews = data.data.reviews;
            const reviewContainer = document.getElementsByClassName('customer-review');
            reviews.forEach(review => {
                const reviewHTML = `
                    <div class="review-card">
                        <h2 class="review-title">${review.title}</h2>
                        <div class="review-meta">
                            <div class="stars">
                                ${[...Array(review.rate)].map(() => '<i class="fas fa-star"></i>').join('')}
                                ${[...Array(5 - review.rate)].map(() => '<i class="far fa-star" style="color:gold;"></i>').join('')}
                            </div>
                            <span class="review-date">${review.modified}</span>
                           
                        </div>
                        <div class="review-meta">
                            <span class="badge verified">${review.verified_purchase !== 0 ? 'Verified Purchase' : ''}</span>
                            <span class="badge recommend"><i class="fas fa-check-circle"></i> ${review.would_recommend !== 0 ? 'Would recommend' : ''}</span>
                        </div>
                        <div class="review-content">
                            <p>${review.description}</p>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <div class="review-author">${review.user}</div>
                            <div class="review-actions">
                                <div>
                                    <i class="far fa-thumbs-up"></i>
                                    <span>Helpful</span> <span class="count">(${review.like})</span>
                                </div>
                            </div>
                        </div>
                        <div class="review-gallery">
                            ${review.images.map(image => `
                                <img onClick="() => showModalDetail(review)" src="http://103.159.51.69:3000/uploads/${image}" alt="Review photo 1" width="160px" height="160px">
                            `).join('')}
                        </div>
                        
                    </div>
                `;
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = reviewHTML;
                reviewContainer[0].appendChild(tempDiv.firstElementChild);
            });
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
        });
}

function getMoreReview() {
    pageIndex++;
    getData(pageIndex + 1);
}

function showModalDetail(review) {
    console.log('review', review)
}
