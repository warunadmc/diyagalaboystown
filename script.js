// Replace this with your actual Blogger JSON feed URL
// Example: 'https://your-blog-name.blogspot.com/feeds/posts/default?alt=json'
const BLOGGER_URL = '';

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navUl = document.querySelector('nav ul');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navUl.classList.toggle('show');
        });
    }

    // Scroll Animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .counter-item, .section-title').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // Fetch Blogger Updates
    const newsContainer = document.getElementById('blogger-feed-container');
    if (newsContainer && BLOGGER_URL) {
        fetch(BLOGGER_URL)
            .then(response => response.json())
            .then(data => {
                const entries = data.feed.entry;
                if (!entries || entries.length === 0) {
                    newsContainer.innerHTML = '<p style="color: var(--text-light);">No recent updates.</p>';
                    return;
                }
                
                newsContainer.innerHTML = ''; // Clear loading text
                
                entries.forEach(entry => {
                    const title = entry.title.$t;
                    const content = entry.content ? entry.content.$t : (entry.summary ? entry.summary.$t : '');
                    const published = new Date(entry.published.$t).toLocaleDateString();
                    
                    const cleanContent = window.DOMPurify ? window.DOMPurify.sanitize(content) : content;
                    
                    const postEl = document.createElement('div');
                    postEl.style.padding = '1.5rem';
                    postEl.style.background = 'rgba(0,0,0,0.2)';
                    postEl.style.borderRadius = '12px';
                    postEl.style.border = '1px solid rgba(255,255,255,0.05)';
                    
                    postEl.innerHTML = `
                        <h4 style="color: var(--white); margin-bottom: 0.5rem; font-family: 'Outfit', sans-serif;">${title}</h4>
                        <span style="display: block; font-size: 0.8rem; color: var(--secondary); margin-bottom: 1rem;">${published}</span>
                        <div style="color: var(--text-light); font-size: 0.95rem; line-height: 1.6;" class="blogger-content">
                            ${cleanContent}
                        </div>
                    `;
                    newsContainer.appendChild(postEl);
                });
            })
            .catch(error => {
                console.error('Error fetching Blogger feed:', error);
                newsContainer.innerHTML = '<p style="color: var(--text-light);">Unable to load updates at this time. Please make sure the Blogger URL is correct and public.</p>';
            });
    } else if (newsContainer && !BLOGGER_URL) {
         newsContainer.innerHTML = '<p style="color: var(--text-light);">Blogger feed URL not configured yet. (Admin: Add your blogger JSON URL in script.js)</p>';
    }

    // Facility Image Carousels
    setInterval(() => {
        document.querySelectorAll('.facility-carousel').forEach(carousel => {
            const images = carousel.querySelectorAll('img');
            if (images.length === 0) return;
            
            let activeIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
            if (activeIndex === -1) activeIndex = 0;
            
            images[activeIndex].classList.remove('active');
            activeIndex = (activeIndex + 1) % images.length;
            images[activeIndex].classList.add('active');
        });
    }, 4000);
});
