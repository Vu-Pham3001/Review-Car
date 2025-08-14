// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initCarousels();
    initReviewSystem();
    addClickHandlers();
    addAnimations();
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
        
        console.log(`Container width: ${containerWidth}, Total width: ${totalWidth}, Max scroll: ${maxScroll}, Current position: ${currentPosition}`);
    }
    
    function scrollTo(position) {
        const containerWidth = container.offsetWidth;
        const totalWidth = container.scrollWidth;
        const maxScroll = Math.max(0, totalWidth - containerWidth);
        
        currentPosition = Math.max(0, Math.min(position, maxScroll));
        container.style.transform = `translateX(-${currentPosition}px)`;
        
        console.log(`Scrolling to: ${currentPosition}px`);
        updateButtons();
    }
    
    prevBtn.addEventListener('click', () => {
        if (prevBtn.disabled) return;
        
        const visibleItems = getVisibleItemsCount();
        const scrollAmount = visibleItems * itemWidth;
        const newPosition = currentPosition - scrollAmount;
        
        console.log(`Prev clicked. Current: ${currentPosition}, New: ${newPosition}, Scroll amount: ${scrollAmount}`);
        scrollTo(newPosition);
    });
    
    nextBtn.addEventListener('click', () => {
        if (nextBtn.disabled) return;
        
        const visibleItems = getVisibleItemsCount();
        const scrollAmount = visibleItems * itemWidth;
        const newPosition = currentPosition + scrollAmount;
        
        console.log(`Next clicked. Current: ${currentPosition}, New: ${newPosition}, Scroll amount: ${scrollAmount}`);
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
        
        console.log(`Resized. New item width: ${itemWidth}, Container width: ${containerWidth}`);
    });
    
    setTimeout(() => {
        updateButtons();
    }, 100);
}

function initReviewSystem() {
    console.log('Review system initialized');
    
    const ratingNumber = document.querySelector('.rating-number');
    if (ratingNumber) {
        animateNumber(ratingNumber, 0, 4.7, 1000);
    }
    
    const recommendationCircle = document.querySelector('.recommendation-circle span');
    if (recommendationCircle) {
        animateNumber(recommendationCircle, 0, 95, 800);
    }
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const startValue = start;
    const endValue = end;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = startValue + (endValue - startValue) * progress;
        
        if (endValue % 1 === 0) {
            element.textContent = Math.floor(currentValue);
        } else {
            element.textContent = currentValue.toFixed(1);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function addClickHandlers() {
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            playVideo(index + 1);
        });
    });
    
    const imageItems = document.querySelectorAll('.image-item');
    imageItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            expandImage(index + 1);
        });
    });
}

function playVideo(videoNumber) {
    alert(`Đang phát video ${videoNumber}...\n\nTrong thực tế, đây sẽ mở video player hoặc modal.`);
    
    const button = event.currentTarget;
    button.style.transform = 'translate(-50%, -50%) scale(0.9)';
    setTimeout(() => {
        button.style.transform = 'translate(-50%, -50%) scale(1.1)';
    }, 150);
}

function expandImage(imageNumber) {
    alert(`Đang mở rộng hình ảnh ${imageNumber}...\n\nTrong thực tế, đây sẽ mở lightbox hoặc modal.`);
    
    const item = event.currentTarget;
    item.style.transform = 'scale(0.95)';
    setTimeout(() => {
        item.style.transform = 'scale(1.05)';
    }, 150);
}

function addAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const items = document.querySelectorAll('.video-item, .image-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.stars i');
    
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', function() {
            for (let i = 0; i <= index; i++) {
                stars[i].style.color = '#f39c12';
                stars[i].style.transform = 'scale(1.2)';
            }
        });
        
        star.addEventListener('mouseleave', function() {
            stars.forEach(s => {
                s.style.color = '#f39c12';
                s.style.transform = 'scale(1)';
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const videoContainer = document.getElementById('videoContainer');
    if (videoContainer) {
        addTouchSupport(videoContainer, 'video');
    }
    
    const imageContainer = document.getElementById('imageContainer');
    if (imageContainer) {
        addTouchSupport(imageContainer, 'image');
    }
});

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
