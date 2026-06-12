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
       CANVAS RADAR SCAN SIMULATION
       ========================================================================== */
    const canvas = document.getElementById('radar-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, cx, cy, maxRadius;
        let angle = 0;
        
        // Target blips on the radar
        const blips = [
            { r: 0.25, theta: 45, size: 5, active: false, intensity: 0 },
            { r: 0.55, theta: 135, size: 6, active: false, intensity: 0 },
            { r: 0.75, theta: 210, size: 8, active: false, intensity: 0 },
            { r: 0.40, theta: 290, size: 4, active: false, intensity: 0 },
            { r: 0.65, theta: 330, size: 6, active: false, intensity: 0 }
        ];

        function resizeCanvas() {
            const rect = canvas.parentElement.getBoundingClientRect();
            width = canvas.width = rect.width;
            height = canvas.height = rect.height;
            cx = width / 2;
            cy = height / 2;
            // Limit sweep radius to fit screen nicely
            maxRadius = Math.min(width, height) * 0.45;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function drawRadar() {
            // Faint trailing fill to draw trailing arc effects
            ctx.fillStyle = 'rgba(2, 9, 6, 0.06)';
            ctx.fillRect(0, 0, width, height);

            // Draw concentric rings
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
            ctx.lineWidth = 1;
            for (let i = 1; i <= 4; i++) {
                ctx.beginPath();
                ctx.arc(cx, cy, maxRadius * (i / 4), 0, Math.PI * 2);
                ctx.stroke();
            }

            // Draw crosshairs
            ctx.beginPath();
            ctx.moveTo(cx - maxRadius, cy);
            ctx.lineTo(cx + maxRadius, cy);
            ctx.moveTo(cx, cy - maxRadius);
            ctx.lineTo(cx, cy + maxRadius);
            ctx.stroke();

            // Increment sweep angle
            angle = (angle + 0.01) % (Math.PI * 2);

            // Draw sweep gradient arc (multiple trailing slices)
            const slices = 40;
            for (let i = 0; i < slices; i++) {
                const sliceAngle = angle - (i * 0.003);
                const alpha = (1 - (i / slices)) * 0.15;
                ctx.strokeStyle = `rgba(165, 219, 248, ${alpha})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(sliceAngle) * maxRadius, cy + Math.sin(sliceAngle) * maxRadius);
                ctx.stroke();
            }

            // Draw sweep edge line
            ctx.strokeStyle = 'rgba(165, 219, 248, 0.35)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * maxRadius, cy + Math.sin(angle) * maxRadius);
            ctx.stroke();

            // Update and draw blips
            blips.forEach(blip => {
                // Radial coordinates
                const bx = cx + Math.cos(blip.theta * Math.PI / 180) * (blip.r * maxRadius);
                const by = cy + Math.sin(blip.theta * Math.PI / 180) * (blip.r * maxRadius);
                
                // Check if sweep line matches blip angle (in radians)
                const blipRad = (blip.theta * Math.PI / 180) % (Math.PI * 2);
                const diff = Math.abs(angle - blipRad);
                
                if (diff < 0.05) {
                    blip.active = true;
                    blip.intensity = 1.0;
                }

                if (blip.active) {
                    // Draw target dot
                    ctx.beginPath();
                    ctx.arc(bx, by, blip.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(165, 219, 248, ${blip.intensity})`;
                    ctx.fill();

                    // Draw outer pulsing ring
                    ctx.beginPath();
                    ctx.arc(bx, by, blip.size + (1 - blip.intensity) * 12, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${blip.intensity * 0.35})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Fade blip
                    blip.intensity -= 0.005;
                    if (blip.intensity <= 0) {
                        blip.active = false;
                        blip.intensity = 0;
                    }
                }
            });

            requestAnimationFrame(drawRadar);
        }

        drawRadar();
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
