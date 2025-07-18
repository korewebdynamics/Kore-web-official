document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS ---
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    const searchToggle = document.getElementById('search-toggle');
    const searchInput = document.getElementById('search-input');
    const navbar = document.querySelector('.navbar');
    
    // Starfield variables
    let scene, camera, renderer, starGeo1, starGeo2, starGeo3, stars1, stars2, stars3;
    let velocities1, velocities2, velocities3, accelerations;

    // --- NAVBAR & MENU LOGIC ---
    if (hamburger && menu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }

    if (searchToggle && searchInput) {
        searchToggle.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                searchInput.classList.toggle('active');
                if (searchInput.classList.contains('active')) {
                    searchInput.focus();
                }
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                alert(`Searching for: ${searchInput.value}`);
                searchInput.value = ''; 
            }
        });
    }

    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768 && hamburger && menu) {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    });

    
     function updateNavbarColor() {
        if (!navbar) return;
        const scrollPosition = window.scrollY;
        const path = window.location.pathname;
        let isOverDarkSection = false;

        
        if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                if (scrollPosition > 100 && scrollPosition < heroBottom - 150) {
                    isOverDarkSection = true;
                }
            }
        
        
        } else if (path.includes('services.html')) {
            
            const darkElements = [
                document.querySelector('.service-header-section'),
                document.getElementById('web-dev-banner'),
                document.querySelector('.parallax-break'),
                document.getElementById('ai')
            ];

            
            for (const element of darkElements) {
                if (element) { // 
                    const elementTop = element.offsetTop - navbar.offsetHeight;
                    const elementBottom = element.offsetTop + element.offsetHeight - navbar.offsetHeight;
                    
                    if (scrollPosition > elementTop && scrollPosition < elementBottom) {
                        isOverDarkSection = true;
                        break; 
                    }
                }
            }
        }
        
        
        if (isOverDarkSection) {
            navbar.classList.add('navbar-dark-text');
        } else {
            navbar.classList.remove('navbar-dark-text');
        }
    }


    
    const typewriterElement = document.getElementById('typewriter');
    let typewriterStarted = false;

    function startTypewriter() {
        if (!typewriterElement || typewriterStarted) return;
        
        typewriterStarted = true;
        const text = 'Automate. Engage. Grow.';
        let index = 0;
        typewriterElement.textContent = '';

        function type() {
            if (index < text.length) {
                typewriterElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            } else {
                typewriterElement.classList.add('typing-done');
            }
        }
        type();
    }

    // --- INTERSECTION OBSERVERS FOR SCROLL ANIMATIONS ---
    const aiSection = document.getElementById('ai-services');
    if (aiSection) {
        const typewriterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startTypewriter();
                    typewriterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        typewriterObserver.observe(aiSection);
    }
    
    // This selector now includes all animated card classes
    const animatedCards = document.querySelectorAll('.slide-card, .plan-card, .service-card, .service-card-animate');
    if (animatedCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedCards.forEach(card => observer.observe(card));
    }

    // --- THREE.JS STARFIELD LOGIC ---
    function initStarfield() {
        const canvas = document.getElementById('three-canvas');
        if (!canvas) return;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 1;
        camera.rotation.x = Math.PI / 2;
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const positions1 = [], positions2 = [], positions3 = [];
        velocities1 = new Float32Array(2000);
        velocities2 = new Float32Array(2000);
        velocities3 = new Float32Array(2000);
        accelerations = new Float32Array(6000).fill(0.02);

        for (let i = 0; i < 2000; i++) {
            positions1.push(Math.random() * 600 - 300, Math.random() * 600 - 300, Math.random() * 600 - 300);
            velocities1[i] = 0;
            positions2.push(Math.random() * 600 - 300, Math.random() * 600 - 300, Math.random() * 600 - 300);
            velocities2[i] = 0;
            positions3.push(Math.random() * 600 - 300, Math.random() * 600 - 300, Math.random() * 600 - 300);
            velocities3[i] = 0;
        }

        starGeo1 = new THREE.BufferGeometry();
        starGeo1.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions1), 3));
        starGeo2 = new THREE.BufferGeometry();
        starGeo2.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions2), 3));
        starGeo3 = new THREE.BufferGeometry();
        starGeo3.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions3), 3));
        const material1 = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.4, transparent: true });
        const material2 = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.5, transparent: true });
        const material3 = new THREE.PointsMaterial({ color: 0xffa500, size: 0.2, transparent: true });
        stars1 = new THREE.Points(starGeo1, material1);
        stars2 = new THREE.Points(starGeo2, material2);
        stars3 = new THREE.Points(starGeo3, material3);
        scene.add(stars1, stars2, stars3);

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        animateStarfield();
    }

    function animateStarfield() {
        if (!stars1 || !stars2 || !stars3 || !starGeo1.attributes.position) return;

        const positions1 = starGeo1.attributes.position.array;
        const positions2 = starGeo2.attributes.position.array;
        const positions3 = starGeo3.attributes.position.array;

        for (let i = 0; i < 2000; i++) {
            const idx = i * 3 + 1;
            velocities1[i] += accelerations[i];
            velocities2[i] += accelerations[i + 2000];
            velocities3[i] += accelerations[i + 4000];
            positions1[idx] -= velocities1[i];
            positions2[idx] -= velocities2[i];
            positions3[idx] -= velocities3[i];

            if (positions1[idx] < -200) { positions1[idx] = 200; velocities1[i] = 0; }
            if (positions2[idx] < -200) { positions2[idx] = 200; velocities2[i] = 0; }
            if (positions3[idx] < -200) { positions3[idx] = 200; velocities3[i] = 0; }
        }

        starGeo1.attributes.position.needsUpdate = true;
        starGeo2.attributes.position.needsUpdate = true;
        starGeo3.attributes.position.needsUpdate = true;
        stars1.rotation.y += 0.002;
        stars2.rotation.y += 0.002;
        stars3.rotation.y += 0.002;

        renderer.render(scene, camera);
        requestAnimationFrame(animateStarfield);
    }

    // --- INITIALIZATION CALLS ---
    if (document.getElementById('three-canvas')) {
        initStarfield();
    }
    
    window.addEventListener('scroll', updateNavbarColor);
    window.addEventListener('resize', updateNavbarColor);
    updateNavbarColor(); // Run on page load
});