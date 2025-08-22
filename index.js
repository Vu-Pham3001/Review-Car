var pageIndex = 0;
var base_img = 'http://103.159.51.69:3000/uploads/images/'
var base_video = 'http://103.159.51.69:3000/uploads/videos/'

document.addEventListener('DOMContentLoaded', function() {
    initCarousels();
    getVideo();
    getImage();
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

function getVideo() {
    fetch(`http://103.159.51.69:3000/api/media/files?type=videos&pageIndex=0&pageSize=10`)
        .then(response => response.json())
        .then(data => {
            const videos = data?.data
            const videoContainer = document.getElementById('videoContainer');
            if (videoContainer && Array.isArray(videos)) {
                videoContainer.innerHTML = videos.map((video, idx) => {
                    const thumbnail = `${base_video}${video.filename}`
                    return `
                        <div class="video-item" onclick="showModalvideo('${thumbnail}')">
                            <div class="video-thumbnail">
                                <video 
                                    src="${thumbnail}" 
                                    controls 
                                    width="180" 
                                    height="120" 
                                    poster="" 
                                    style="border-radius: 8px; background: #000;"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div class="video-rating">
                                <div class="stars">
                                    ${[...Array(5)].map(() => '<div class="star"></div>').join('')}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        })
}

function getImage() {
    fetch(`http://103.159.51.69:3000/api/media/files?type=images&pageIndex=0&pageSize=10`)
        .then(response => response.json())
        .then(data => {
            const images = data?.data
            const imageContainer = document.getElementById('imageContainer');
            if (imageContainer && Array.isArray(images)) {
                imageContainer.innerHTML = images.map((image, idx) => {
                    const imgSrc = `${base_img}${image.filename}`;
                    return `
                        <div class="image-item">
                            <img onClick="getImageDetail(${image.reviewId})" src="${imgSrc}" alt="Review image ${idx + 1}">
                        </div>
                    `;
                }).join('');
            }
    })
}

function getImageDetail(id) {
    fetch(`http://103.159.51.69:3000/api/reviews/${id}`)
        .then(response => response.json())
        .then(data => {
            const review = data.data
            showModalDetail(review)
    })
}

function getData(pageIndex) {
    fetch(`http://103.159.51.69:3000/api/reviews?pageIndex=${pageIndex}&pageSize=8`)
        .then(response => response.json())
        .then(data => {
            const reviews = data.data.reviews;
            const reviewContainer = document.getElementsByClassName('customer-review');
            reviews.forEach(review => {
                const reviewHTML = `
                    <div class="review-card">
                        <h2 class="review-title">${review.title}</h2>
                        <div class="review-meta">
                            <div class="stars" style="margin-right: 10px;">
                                ${[...Array(review.rate)].map(() => '<div class="star"></div>').join('')}
                                ${[...Array(5 - review.rate)].map(() => `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                                        <polygon 
                                            points="12,2 14.09,8.26 20.18,8.27 15,12.14 17.18,18.02 12,14.27 6.82,18.02 9,12.14 3.82,8.27 9.91,8.26"
                                            fill="white"
                                            stroke="#fde047"
                                            stroke-width="1.5"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                `).join('')}
                            </div>
                            <span class="review-date">${new Date(review.modified).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div class="review-meta">
                            ${review.verified_purchase !== 0 ? `<span class="badge verified">Verified Purchase</span>` : ''}
                            ${review.would_recommend !== 0 ? `<span class="badge recommend"><i class="fas fa-check-circle"></i> Would recommend</span>` : ''}
                        </div>
                        <div class="review-content">
                            <p>${review.description ?? ''}</p>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <div class="review-author">${review.user}</div>
                            <div class="review-actions">
                                <div>
                                    <i class="far fa-thumbs-up"></i>
                                    <span>Helpful</span> <span class="count">(${review.rate ?? 0})</span>
                                </div>
                            </div>
                        </div>
                        <div class="review-gallery">
                            ${review.images.map(image => `
                                <img onclick="showModalDetail(${JSON.stringify(review).replace(/"/g, '&quot;')})" src="${base_img}${image}" alt="Review photo 1" width="160px" height="160px">
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

function showModalvideo(videoSrc) {
    const modal = document.getElementById('reviewModal');
    const modalContent = document.getElementById('modalContent');
    const modalContentWrapper = modalContent.closest('.modal-content');
    if (modalContentWrapper) {
        modalContentWrapper.style.maxWidth = '800px';
    }

    modalContent.innerHTML = `
        <div class="review-modal">
            <div class="modal-topbar">
                <button class="back-btn" aria-label="Back" onclick="(function(){document.getElementById('reviewModal').style.display='none'})()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <span class="topbar-title">Video</span>
            </div>
            <div style="padding: 20px 24px 24px">
                <div class="modal-media">
                    <div class="media-viewer">
                        <video id="modalMainVideo" src="${videoSrc}" controls autoplay style="width: 100%; height: 520px; object-fit: contain; background: #000; display: block;"></video>
                    </div>
                </div>
                <div class="modal-details"></div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
            const modalContentWrapper = document.getElementById('modalContent').closest('.modal-content');
            if (modalContentWrapper) modalContentWrapper.style.maxWidth = '1280px';
        }
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            const modalContentWrapper = document.getElementById('modalContent').closest('.modal-content');
            if (modalContentWrapper) modalContentWrapper.style.maxWidth = '1280px';
        }
    }
    
    const handleEsc = function(e) {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
            const modalContentWrapper = document.getElementById('modalContent').closest('.modal-content');
            if (modalContentWrapper) modalContentWrapper.style.maxWidth = '1280px';
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

function showModalDetail(review) {
    const modal = document.getElementById('reviewModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div class="review-modal">
            <div class="modal-topbar" onclick="(function(){document.getElementById('reviewModal').style.display='none'})()">
                <button class="back-btn" aria-label="Back" >
                    <i class="fas fa-arrow-left"></i>
                </button>
                <span class="topbar-title">All Photos</span>
            </div>
            <div class="review-modal-body">
                <div class="modal-media">
                    <div class="media-viewer">
                        <img id="modalMainImg" src="${base_img}${review.images[0]}" alt="review image">
                        <button class="media-nav prev" id="mediaPrev"><i class="fas fa-chevron-left"></i></button>
                        <button class="media-nav next" id="mediaNext"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                <div class="modal-details">
                    <div class="detail-title">${review.title}</div>
                    <div class="detail-meta-line">
                        <div class="stars">
                        ${[...Array(review.rate)].map(() => '<div class="star"></div>').join('')}
                        ${[...Array(5 - review.rate)].map(() => `
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <polygon 
                                    points="12,2 14.09,8.26 20.18,8.27 15,12.14 17.18,18.02 12,14.27 6.82,18.02 9,12.14 3.82,8.27 9.91,8.26"
                                    fill="white"
                                    stroke="#fde047"
                                    stroke-width="1.5"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        `).join('')}
                        </div>
                        <span class="review-date">${new Date(review.modified).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        
                    </div>
                    <div class="detail-meta-line">
                        ${review.verified_purchase !== 0 ? `<span class="badge verified">Verified Purchase</span>` : ''}
                        ${review.would_recommend !== 0 ? `<span class="badge recommend"><i class="fas fa-check-circle"></i> Would recommend</span>` : ''}
                    </div>
                    <div class="detail-text">${review.description}</div>
                    <div class="detail-footer">
                        <div class="author">${review.user}</div>
                        <div class="helpful"><i class="far fa-thumbs-up"></i> Helpful <span class="count">(${review.rate ?? 0})</span></div>
                    </div>
                    <div class="media-thumbs" id="mediaThumbs">
                        ${review.images.map((image, i) => `
                            <img data-index="${i}" class="${i===0 ? 'active' : ''}" src="${base_img}${image}" alt="thumb ${i+1}">
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    const closeBtn = document.querySelector('.close');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    let currentIndex = 0;
    const mainImg = document.getElementById('modalMainImg');
    const prevBtn = document.getElementById('mediaPrev');
    const nextBtn = document.getElementById('mediaNext');
    const thumbsWrap = document.getElementById('mediaThumbs');
    const thumbs = thumbsWrap ? Array.from(thumbsWrap.querySelectorAll('img')) : [];
    const totalImages = Array.isArray(review.images) ? review.images.length : 0;

    function updateNavDisabled() {
        const disabled = totalImages <= 1;
        if (prevBtn) prevBtn.disabled = disabled;
        if (nextBtn) nextBtn.disabled = disabled;
    }

    function setActive(index) {
        if (!totalImages || !mainImg) return;
        currentIndex = (index + totalImages) % totalImages;
        mainImg.src = `${base_img}${review.images[currentIndex]}`;
        thumbs.forEach((t, i) => {
            if (i === currentIndex) t.classList.add('active');
            else t.classList.remove('active');
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => setActive(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => setActive(currentIndex + 1));
    thumbs.forEach(t => t.addEventListener('click', () => setActive(parseInt(t.getAttribute('data-index'), 10))));

    setActive(0);
    updateNavDisabled();

    function handleKey(e){
        if (modal.style.display !== 'block') return;
        if (e.key === 'ArrowLeft') setActive(currentIndex - 1);
        if (e.key === 'ArrowRight') setActive(currentIndex + 1);
        if (e.key === 'Escape') modal.style.display = 'none';
    }
    document.addEventListener('keydown', handleKey, { once: false });
}

function openImageLightbox(imageSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${imageSrc}" alt="Full size image">
        </div>
    `;
    
    document.body.appendChild(lightbox);
    
    const closeLightbox = () => {
        document.body.removeChild(lightbox);
    };
    
    lightbox.querySelector('.lightbox-close').onclick = closeLightbox;
    lightbox.onclick = (e) => {
        if (e.target === lightbox) closeLightbox();
    };
}
