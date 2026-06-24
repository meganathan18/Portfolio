/* ==========================================================================
   INTERACTIVE SCRIPTS - MEGANATHAN M PORTFOLIO
   Features: Particles, Typing, Theme Toggle, Modal, Carousel, Counters, Filters
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MOBILE MENU NAVIGATION DRAWER
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    };

    hamburger.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));


    // ==========================================
    // 2. THEME SWITCHING (DARK / LIGHT)
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference in localStorage, default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    body.className = savedTheme;

    const toggleTheme = () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        }
        
        // Dynamically adjust particle theme configurations
        updateParticleColors();
    };

    themeToggle.addEventListener('click', toggleTheme);


    // ==========================================
    // 3. SCROLL PROGRESS INDICATOR BAR
    // ==========================================
    const scrollProgressBar = document.getElementById('scroll-progress');
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        scrollProgressBar.style.width = `${scrollPercentage}%`;

        // Toggle sticky header styling on scroll
        if (scrollTop > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = 'none';
        }

        // Active Link Highlighting on Scroll
        let currentSectionId = 'home';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // ==========================================
    // 4. TYPING ANIMATION (HERO SECTION)
    // ==========================================
    const typingText = document.getElementById('typing-text');
    const roles = ["Java Developer", "Full Stack Developer", "Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 120;

    const typeEffect = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 50; // Speed up deleting
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 100; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Word fully typed, pause before deleting
            isDeleting = true;
            typingDelay = 2000;
        } else if (isDeleting && charIndex === 0) {
            // Word fully deleted, move to next
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingDelay = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingDelay);
    };

    // Initialize typing
    if (typingText) {
        setTimeout(typeEffect, 1000);
    }


    // ==========================================
    // 5. CANVAS PARTICLE BACKGROUND SYSTEM
    // ==========================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let particleCount = 80;
    let connectionDistance = 110;
    let mouse = { x: null, y: null, radius: 150 };

    // Sizing canvas to window
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Adjust particle density based on screen width
        if (window.innerWidth < 768) {
            particleCount = 35;
            connectionDistance = 80;
        } else {
            particleCount = 85;
            connectionDistance = 120;
        }
        initParticles();
    };

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Object blueprint
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 1;
            
            // Random direction vectors
            this.speedX = Math.random() * 0.8 - 0.4;
            this.speedY = Math.random() * 0.8 - 0.4;
            
            // Set primary color palette
            this.colorType = Math.random() > 0.5 ? 'blue' : 'purple';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off boundary edges
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Mouse repulsion interactive effect
            if (mouse.x != null && mouse.y != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.hypot(dx, dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const forceX = (dx / distance) * force * 1.5;
                    const forceY = (dy / distance) * force * 1.5;
                    this.x += forceX;
                    this.y += forceY;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            let colorString = '';
            const isDark = body.classList.contains('dark-theme');
            
            if (this.colorType === 'blue') {
                colorString = isDark ? 'rgba(59, 130, 246, 0.45)' : 'rgba(37, 99, 235, 0.35)';
            } else {
                colorString = isDark ? 'rgba(168, 85, 247, 0.45)' : 'rgba(147, 51, 234, 0.35)';
            }
            
            ctx.fillStyle = colorString;
            ctx.fill();
        }
    }

    const initParticles = () => {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };

    // Draw connecting lines between close nodes
    const connectParticles = () => {
        const isDark = body.classList.contains('dark-theme');
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.hypot(dx, dy);

                if (distance < connectionDistance) {
                    let opacity = (1 - (distance / connectionDistance)) * 0.15;
                    
                    // Choose connection color matching node palette
                    let color = '';
                    if (particles[i].colorType === 'blue' || particles[j].colorType === 'blue') {
                        color = isDark ? `rgba(59, 130, 246, ${opacity})` : `rgba(37, 99, 235, ${opacity})`;
                    } else {
                        color = isDark ? `rgba(168, 85, 247, ${opacity})` : `rgba(147, 51, 234, ${opacity})`;
                    }

                    ctx.strokeStyle = color;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animateParticles);
    };

    const updateParticleColors = () => {
        // Colors update dynamically inside the animation frame loop reading the current theme classes
    };

    // Initial canvas setup
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();


    // ==========================================
    // 6. PROJECTS CATEGORY FILTER SYSTEM
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all') {
                    card.classList.remove('hide');
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else if (category === filterValue) {
                    card.classList.remove('hide');
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });


    // ==========================================
    // 7. SMART GRIEVANCE IMAGES CAROUSEL
    // ==========================================
    const prevBtn = document.getElementById('prev-grievance');
    const nextBtn = document.getElementById('next-grievance');
    const slidesTrack = document.getElementById('grievance-slides');
    const indicators = document.querySelectorAll('#grievance-indicators .indicator');
    
    let currentSlide = 0;
    const totalSlides = 3;

    const updateCarousel = (index) => {
        // Handle wrap-around index values
        if (index >= totalSlides) currentSlide = 0;
        else if (index < 0) currentSlide = totalSlides - 1;
        else currentSlide = index;

        // Perform translation shift
        slidesTrack.style.transform = `translateX(-${(currentSlide * 33.333)}%)`;

        // Update dot indicator markers
        indicators.forEach(ind => ind.classList.remove('active'));
        indicators[currentSlide].classList.add('active');
    };

    nextBtn.addEventListener('click', () => updateCarousel(currentSlide + 1));
    prevBtn.addEventListener('click', () => updateCarousel(currentSlide - 1));

    indicators.forEach(ind => {
        ind.addEventListener('click', (e) => {
            const targetSlide = parseInt(e.target.getAttribute('data-slide'));
            updateCarousel(targetSlide);
        });
    });


    // ==========================================
    // 8. URL SHORTENER HIGHLIGHT DETAILS MODAL
    // ==========================================
    const openModalBtn = document.getElementById('open-shortener-details');
    const closeModalBtn = document.getElementById('close-shortener-modal');
    const modalOverlay = document.getElementById('shortener-modal');

    const openModal = () => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore background scrolling
    };

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal on click outside content
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Close modal on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });


    // ==========================================
    // 9. ANIMATED COUNTERS (ACHIEVEMENTS)
    // ==========================================
    const counters = document.querySelectorAll('.counter-number');
    const speed = 1500; // Complete counter duration in ms

    const runCounters = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const start = 0;
        let startTime = null;

        const animateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const currentVal = Math.min(Math.floor((progress / speed) * target), target);
            
            counter.textContent = currentVal;

            if (progress < speed) {
                requestAnimationFrame(animateCount);
            } else {
                counter.textContent = target; // Clamp to exact target at end
            }
        };

        requestAnimationFrame(animateCount);
    };

    // Trigger counters animation only when in scroll viewport view
    const achievementSection = document.getElementById('achievements');
    let hasAnimated = false;

    const observerOptions = {
        root: null,
        threshold: 0.25 // Trigger when 25% of the section is visible
    };

    const achievementsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                counters.forEach(c => runCounters(c));
                hasAnimated = true; // Run only once
                achievementsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (achievementSection) {
        achievementsObserver.observe(achievementSection);
    }


    // ==========================================
    // 10. CONTACT FORM SUBMISSION HANDLER (MOCK)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const successOverlay = document.getElementById('form-success-overlay');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop page reload

        // Trigger visual button loading state
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span><i class="fa-solid fa-spinner fa-spin"></i> Sending...</span>`;

        // Simulate secure API posting latency
        setTimeout(() => {
            // Restore button properties
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;

            // Trigger success overlay animation popup
            successOverlay.classList.add('active');

            // Reset form fields
            contactForm.reset();
        }, 1500);
    });

    // Close success overlay toast
    closeSuccessBtn.addEventListener('click', () => {
        successOverlay.classList.remove('active');
    });

    // Also close success overlay on background click
    successOverlay.addEventListener('click', (e) => {
        if (e.target === successOverlay) {
            successOverlay.classList.remove('active');
        }
    });
});
