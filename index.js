document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       NAVBAR SCROLL EFFECT & MOBILE TOGGLE
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Close menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });


    /* ==========================================================================
       TAGLINE TYPEWRITER ANIMATION
       ========================================================================== */
    const taglines = [
        "Techno-Commercial Liaison",
        "AI Engineer & Software Developer",
        "Developer Community Leader"
    ];
    let taglineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const taglineElement = document.getElementById('tagline-text');
    let typingSpeed = 100;

    function typeTagline() {
        const currentTagline = taglines[taglineIndex];
        
        if (isDeleting) {
            taglineElement.textContent = currentTagline.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40; // delete faster
        } else {
            taglineElement.textContent = currentTagline.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90; // normal typing
        }

        if (!isDeleting && charIndex === currentTagline.length) {
            // pause at full word
            isDeleting = true;
            typingSpeed = 2000; // hold
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            taglineIndex = (taglineIndex + 1) % taglines.length;
            typingSpeed = 500; // short pause before typing next
        }

        setTimeout(typeTagline, typingSpeed);
    }
    
    // Start typewriter
    typeTagline();


    /* ==========================================================================
       CANVAS CONSTELLATION NETWORK SIMULATION (LINKEDIN VIBES)
       ========================================================================== */
    const canvas = document.getElementById('radar-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        const particles = [];
        const particleCount = 70;
        const connectionDistance = 110;
        const mouseConnectionDistance = 150;
        const mouse = { x: null, y: null };

        function resizeCanvas() {
            const rect = canvas.parentElement.getBoundingClientRect();
            width = canvas.width = rect.width;
            height = canvas.height = rect.height;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(217, 119, 6, 0.35)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function animate() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update();
                p.draw();

                // Connect to mouse
                if (mouse.x !== null && mouse.y !== null) {
                    const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                    if (dist < mouseConnectionDistance) {
                        const alpha = (1 - dist / mouseConnectionDistance) * 0.15;
                        ctx.strokeStyle = `rgba(217, 119, 6, ${alpha})`;
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }

                // Connect to other particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * 0.07;
                        ctx.strokeStyle = `rgba(254, 243, 199, ${alpha})`;
                        ctx.lineWidth = 0.4;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
    }


    /* ==========================================================================
       SCROLL REVEAL & SKILLS PROGRESS ANIMATION
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    const skillProgresses = document.querySelectorAll('.skill-progress');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Animate skills progress bars when they come into view
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progresses = entry.target.querySelectorAll('.skill-progress');
                progresses.forEach(prog => {
                    const widthVal = prog.style.width;
                    prog.style.width = '0%';
                    setTimeout(() => {
                        prog.style.width = widthVal;
                    }, 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }


    /* ==========================================================================
       SKILLS CATEGORY FILTER
       ========================================================================== */
    const tabs = document.querySelectorAll('.skill-tab');
    const skillItems = document.querySelectorAll('.skill-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Set active tab class
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.getAttribute('data-category');

            skillItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'flex';
                    // Reset animation state
                    const prog = item.querySelector('.skill-progress');
                    if (prog) {
                        const w = prog.style.width;
                        prog.style.style = '0%';
                        setTimeout(() => { prog.style.width = w; }, 50);
                    }
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });


    /* ==========================================================================
       CERTIFICATE LIGHTBOX PREVIEW
       ========================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const certContainers = document.querySelectorAll('.cert-img-container');

    certContainers.forEach(container => {
        container.addEventListener('click', () => {
            const img = container.querySelector('.cert-img');
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt;
            lightbox.classList.add('show');
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('show');
    }

    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on click outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg && e.target !== lightboxCaption) {
            closeLightbox();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });


    /* ==========================================================================
       CONTACT FORM SUBMIT & STORAGE & TOAST
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        
        let iconClass = 'fa-solid fa-circle-check';
        if (type === 'error') {
            iconClass = 'fa-solid fa-triangle-exclamation';
            toast.style.borderColor = '#ef4444';
        }
        
        toast.innerHTML = `
            <i class="${iconClass} toast-icon"></i>
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger show class for transition
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 4500);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Form data package
            const formData = {
                name,
                email,
                subject,
                message,
                timestamp: new Date().toISOString()
            };

            try {
                // Save to localStorage
                let messages = JSON.parse(localStorage.getItem('aditi_portfolio_messages') || '[]');
                messages.push(formData);
                localStorage.setItem('aditi_portfolio_messages', JSON.stringify(messages));
                
                // Show success toast
                showToast(`Thank you, ${name}! Your message has been sent successfully.`);
                
                // Clear the form
                contactForm.reset();
            } catch (err) {
                console.error("Local storage error:", err);
                showToast("Something went wrong. Please try again later.", "error");
            }
        });
    }

});
