var pageIndex = 0;
var base_img = 'http://103.159.51.69:3000/uploads/images/'
var base_video = 'http://103.159.51.69:3000/uploads/videos/'

document.addEventListener('DOMContentLoaded', function() {
    getVideo();
    getImage();
    getData(pageIndex);
    
    initDragScroll();
});

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
        .catch(error => {
            console.error('Error loading videos:', error);
        });
}

function getImage() {
    fetch(`http://103.159.51.69:3000/api/media/files?type=images&pageIndex=0&pageSize=10`)
        .then(response => response.json())
        .then(data => {
            const images = data?.data;
            const imageContainer = document.getElementById('imageContainer');
            if (imageContainer && Array.isArray(images)) {
                imageContainer.innerHTML = '';
                
                images.forEach((image, idx) => {
                    const imgSrc = `${base_img}${image.filename}`;
                    const imgEl = document.createElement('img');
                    imgEl.src = imgSrc;
                    imgEl.alt = `Review image ${idx + 1}`;
                    imgEl.width = 160;
                    imgEl.height = 160;

                    imgEl.addEventListener('click', () => {
                        getImageDetail(image.reviewId);
                    });

                    const wrapper = document.createElement('div');
                    wrapper.className = 'image-item';
                    wrapper.appendChild(imgEl);

                    imageContainer.appendChild(wrapper);
                });
            }
        });
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
                                    <i onClick="onLike(${JSON.stringify(review).replace(/"/g, '&quot;')})" class="far fa-thumbs-up"></i>
                                    <span>Helpful</span> <span id="likeCount-${review.id}" class="count">(${review.rate ?? 0})</span>
                                </div>
                            </div>
                        </div>
                        <div class="review-gallery">
                            ${review.images.map((image, i) => `
                                <img 
                                    class="review-img" 
                                    data-review-id="${review.id}" 
                                    data-index="${i}" 
                                    src="${base_img}${image}" 
                                    alt="Review photo ${i+1}" 
                                    width="160px" 
                                    height="160px"
                                >
                            `).join('')}
                        </div>
                    </div>
                `;

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = reviewHTML;

                const galleryImgs = tempDiv.querySelectorAll('.review-img');
                galleryImgs.forEach(img => {
                    img.addEventListener('click', () => {
                        showModalDetail(review);
                    });
                });

                reviewContainer[0].appendChild(tempDiv.firstElementChild);
            });
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
        });
}


function onLike(item) {
    const review = item;
    const elementLike = document.getElementById(`likeCount-${review.id}`);
    if (elementLike) {
        const currentRate = parseInt(elementLike.textContent.replace(/[()]/g, ""), 10) || 0;
        const newRate = currentRate + 1;
        elementLike.textContent = `(${newRate})`;
    }
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

function initDragScroll() {
    const containers = document.querySelectorAll('.video-reviews, .image-reviews');
    
    containers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.style.cursor = 'grabbing';
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });
        
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Tốc độ scroll
            container.scrollLeft = scrollLeft - walk;
        });
    });
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
