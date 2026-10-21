/**
 * SILK & STONE - Core Interactive UI Logic
 * Handles multi-page navigation active states, mobile drawer,
 * portfolio filtering, project lightbox modal, and consultation form handling.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-item');
    const contactForm = document.getElementById('consultation-form');
    const formFeedback = document.getElementById('form-feedback');
    const newsletterForm = document.getElementById('newsletter-form');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    const toastNotice = document.getElementById('toast-notice');

    // --- Toast Helper ---
    function showToast(message) {
        if (!toastNotice) return;
        const textEl = toastNotice.querySelector('.toast-text') || toastNotice;
        textEl.textContent = message;
        toastNotice.classList.add('show');
        setTimeout(() => {
            toastNotice.classList.remove('show');
        }, 3500);
    }

    // --- Active Navigation based on Current Page URL ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href')?.split('/').pop();
        if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else if (linkHref && !linkHref.startsWith('#')) {
            link.classList.remove('active');
        }
    });

    // --- Smooth Scrolling for In-Page Anchor Links (if any) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 76;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                if (mobileNav && !mobileNav.classList.contains('hidden')) {
                    mobileNav.classList.add('hidden');
                }
            }
        });
    });

    // --- Mobile Menu Toggle ---
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileNav.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mobileNav.classList.add('hidden');
            }
        });
    }

    // --- Portfolio Category Filter ---
    if (filterBtns.length > 0 && portfolioCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                portfolioCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category') || '';
                    const cardTags = card.getAttribute('data-tags') || '';
                    const matches = filter === 'All' || 
                                    cardCategory === filter || 
                                    cardTags.toLowerCase().includes(filter.toLowerCase());

                    if (matches) {
                        card.classList.remove('hidden-item');
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.classList.add('hidden-item');
                    }
                });
            });
        });
    }

    // --- Project Case Study Modal Viewer ---
    const lightboxLocation = document.getElementById('lightbox-location');
    const lightboxYear = document.getElementById('lightbox-year');
    const lightboxSqft = document.getElementById('lightbox-sqft');
    const lightboxPalette = document.getElementById('lightbox-palette');
    const lightboxBrief = document.getElementById('lightbox-brief');
    const lightboxSolution = document.getElementById('lightbox-solution');
    const lightboxInquireBtn = document.getElementById('lightbox-inquire-btn');

    portfolioCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('http')) return;

            e.preventDefault();
            const img = card.querySelector('img');
            const title = card.querySelector('h3');
            const category = card.getAttribute('data-category');
            const location = card.getAttribute('data-location') || 'Nairobi, Kenya';
            const year = card.getAttribute('data-year') || '2024';
            const sqft = card.getAttribute('data-sqft') || 'Bespoke Interior Commission';
            const palette = card.getAttribute('data-palette') || 'Natural Stone · Custom Timber · Linen';
            const brief = card.getAttribute('data-brief') || card.querySelector('p')?.textContent || '';
            const solution = card.getAttribute('data-solution') || 'Executed with bespoke artisanal millwork, natural stone curation, and tailored architectural lighting.';

            if (lightboxModal && img) {
                if (lightboxImg) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt || (title ? title.textContent : '');
                }
                if (lightboxTitle) lightboxTitle.textContent = title ? title.textContent : '';
                if (lightboxCategory) lightboxCategory.textContent = category || 'Interior Architecture';
                if (lightboxLocation) lightboxLocation.textContent = location;
                if (lightboxYear) lightboxYear.textContent = year;
                if (lightboxSqft) lightboxSqft.textContent = sqft;
                if (lightboxPalette) lightboxPalette.textContent = palette;
                if (lightboxBrief) lightboxBrief.textContent = brief;
                if (lightboxSolution) lightboxSolution.textContent = solution;

                if (lightboxInquireBtn && title) {
                    lightboxInquireBtn.href = `contact.html?project=${encodeURIComponent(title.textContent)}`;
                }

                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (lightboxClose && lightboxModal) {
        const closeModal = () => {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        lightboxClose.addEventListener('click', closeModal);
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // --- Consultation Form Submission ---
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Sending...</span>`;
            }

            setTimeout(() => {
                if (contactForm) {
                    contactForm.style.display = 'none';
                }
                if (formFeedback) {
                    formFeedback.classList.remove('hidden');
                    formFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                showToast("Thank you! Your consultation inquiry has been submitted.");
            }, 800);
        });
    }

    // --- Newsletter Form Submission ---
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input[type="email"]');
            if (input && input.value) {
                input.value = '';
                showToast("Thank you for subscribing to SILK & STONE updates.");
            }
        });
    }

    // --- Intersection Observer for Scroll Reveals ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('reveal-on-scroll');
                    entry.target.classList.add('animate-fade-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.remove('reveal-on-scroll'));
    }

    // --- Pre-fill Contact Form from Portfolio Case Study Query Parameter ---
    const urlParams = new URLSearchParams(window.location.search);
    const projectParam = urlParams.get('project');
    if (projectParam && contactForm) {
        const messageBox = contactForm.querySelector('textarea[name="message"]');
        if (messageBox) {
            messageBox.value = `Hello SILK & STONE team,\n\nI was particularly inspired by your commission "${projectParam}" in your portfolio. I would love to explore a similar architectural and tactile approach for our space.\n\nHere are some initial details regarding our location and vision: `;
            messageBox.focus();
        }
    }
});