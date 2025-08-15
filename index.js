document.addEventListener('DOMContentLoaded', function() {
    initCarousels();
    getData();
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

function getData() {
    console.log('getData');
    const ratingNumber = document.getElementsByClassName('rating-number')
    ratingNumber[0].innerHTML = '4.7'  
    const numberStart = 3;

    const stars = [];
    const fullStars = Math.floor(numberStart);
    const hasHalfStar = numberStart % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars.push('<i class="fas fa-star"></i>');
    }
    if (hasHalfStar) {
        stars.push('<i class="fas fa-star-half-alt"></i>');
    }

    const starsElements = document.getElementsByClassName('stars');
    if (starsElements.length > 0) {
        starsElements[0].innerHTML = stars.join('');
    }

}
