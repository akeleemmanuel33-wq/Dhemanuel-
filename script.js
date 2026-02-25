   // ── Page Loader ──
        window.addEventListener('load', () => {
            const loader = document.getElementById('page-loader');
            // Small delay to ensure smooth transition
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 500);
        });

        // Fallback: hide loader after 5 seconds regardless
        setTimeout(() => {
            const loader = document.getElementById('page-loader');
            if (loader && !loader.classList.contains('hidden')) {
                loader.classList.add('hidden');
            }
        }, 5000);

        // Theme Toggle Functionality
        const themeToggle = document.getElementById('themeToggle');
        const themeToggleMobile = document.getElementById('themeToggleMobile');
        const html = document.documentElement;

        // Check for saved theme preference or default to 'light'
        const currentTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', currentTheme);

        function toggleTheme() {
            const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }

        themeToggle.addEventListener('click', toggleTheme);
        themeToggleMobile.addEventListener('click', toggleTheme);

        // Header scroll effect
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Hamburger menu toggle
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });

        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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

        // Intersection Observer for fade-in animations on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe service cards
        document.querySelectorAll('.service-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe project cards
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe experience items
        document.querySelectorAll('.experience-item').forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            observer.observe(item);
        });

        // Web3Forms Contact Form Submission
        const contactForm = document.getElementById('contactForm');
        const submitButton = document.getElementById('submitButton');
        const formMessage = document.getElementById('formMessage');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            formMessage.style.display = 'none';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    formMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                    formMessage.className = 'form-message success';
                    formMessage.style.display = 'block';
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                formMessage.textContent = 'Oops! Something went wrong. Please try again.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        });
        // ── Hero Canvas Particles ──
        (function () {
            const canvas  = document.getElementById('hero-canvas');
            const ctx     = canvas.getContext('2d');
            const hero    = document.querySelector('.hero');
            let   W, H, particles = [];

            const COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#a855f7'];
            const COUNT  = 70;

            function resize () {
                W = canvas.width  = hero.offsetWidth;
                H = canvas.height = hero.offsetHeight;
            }

            function rand (min, max) { return Math.random() * (max - min) + min; }

            function make () {
                return {
                    x  : rand(0, W),
                    y  : rand(0, H),
                    r  : rand(1, 3.5),
                    dx : rand(-0.4, 0.4),
                    dy : rand(-0.6, -0.15),
                    op : rand(0.3, 0.9),
                    col: COLORS[Math.floor(Math.random() * COLORS.length)]
                };
            }

            function init () {
                resize();
                particles = Array.from({ length: COUNT }, make);
            }

            function draw () {
                ctx.clearRect(0, 0, W, H);
                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = p.col;
                    ctx.globalAlpha = p.op;
                    ctx.fill();

                    p.x += p.dx;
                    p.y += p.dy;

                    // reset when off-screen
                    if (p.y < -10 || p.x < -10 || p.x > W + 10) {
                        Object.assign(p, make(), { y: H + 5 });
                    }
                });
                ctx.globalAlpha = 1;
                requestAnimationFrame(draw);
            }

            window.addEventListener('resize', () => { resize(); });
            init();
            draw();
        })();

        // ── Typewriter ──
        (function () {
            const el    = document.getElementById('typewriter-text');
            const words = ['Dev Hemanuel', 'Web Developer', 'Software Engineer', 'UI/UX Designer'];
            let   wi = 0, ci = 0, deleting = false, pauseTimer = null;

            function tick () {
                const word    = words[wi];
                const display = deleting ? word.slice(0, ci--) : word.slice(0, ++ci);
                el.textContent = display;

                let delay = deleting ? 60 : 110;

                if (!deleting && ci === word.length) {
                    delay = 1800;
                    deleting = true;
                } else if (deleting && ci === 0) {
                    deleting = false;
                    wi = (wi + 1) % words.length;
                    delay = 400;
                }

                clearTimeout(pauseTimer);
                pauseTimer = setTimeout(tick, delay);
            }

            tick();
        })();