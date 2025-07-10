document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    const searchToggle = document.getElementById('search-toggle');
    const searchInput = document.getElementById('search-input');
    const navbar = document.querySelector('.navbar');
    let scene, camera, renderer, starGeo1, starGeo2, starGeo3, stars1, stars2, stars3;
    let velocities1, velocities2, velocities3, accelerations;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
    });

    searchToggle.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            searchInput.classList.toggle('active');
            if (searchInput.classList.contains('active')) {
                searchInput.focus();
            }
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            alert(`Searching for: ${searchInput.value}`);
            searchInput.value = '';
        }
    });

    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    });

    function updateNavbarColor() {
        const scrollPosition = window.scrollY;
        if (window.location.pathname.includes('services.html')) {
            const hostingIntroSection = document.querySelector('.hosting-intro-section');
            const hostSection = document.getElementById('host');
            const servicesSection = document.getElementById('services');

            const hostingIntroTop = hostingIntroSection ? hostingIntroSection.getBoundingClientRect().top + scrollPosition : 0;
            const hostTop = hostSection ? hostSection.getBoundingClientRect().top + scrollPosition : Infinity;
            const hostBottom = hostSection ? hostTop + hostSection.offsetHeight : Infinity;
            const servicesTop = servicesSection ? servicesSection.getBoundingClientRect().top + scrollPosition : Infinity;

            if (scrollPosition < hostBottom) {
                
                navbar.classList.remove('navbar-dark-text');
            } else if (scrollPosition >= hostBottom && scrollPosition < servicesTop + 100) {
                
                navbar.classList.add('navbar-dark-text');
            } else {
               
                navbar.classList.add('navbar-dark-text');
            }
        } else {
            const heroSection = document.getElementById('hero');
            const welcomeSection = document.querySelector('.welcome-section');
            const introSection = document.getElementById('intro-animation');
            const servicesSection = document.getElementById('Main');

            if (heroSection && welcomeSection && introSection && servicesSection) {
                const heroTop = heroSection.getBoundingClientRect().top + scrollPosition;
                const heroBottom = heroTop + heroSection.offsetHeight;
                const welcomeTop = welcomeSection.getBoundingClientRect().top + scrollPosition;
                const welcomeBottom = welcomeTop + welcomeSection.offsetHeight;
                const introTop = introSection.getBoundingClientRect().top + scrollPosition;
                const introBottom = introTop + introSection.offsetHeight;
                const servicesTop = servicesSection.getBoundingClientRect().top + scrollPosition;
                const servicesBottom = servicesTop + servicesSection.offsetHeight;

                if (scrollPosition < heroTop || scrollPosition >= heroBottom - 100) {
                    navbar.classList.remove('navbar-dark-text');
                } else if (scrollPosition >= heroTop && scrollPosition < heroBottom - 100) {
                    navbar.classList.add('navbar-dark-text');
                } else if (scrollPosition >= welcomeTop && scrollPosition < welcomeBottom) {
                    navbar.classList.remove('navbar-dark-text');
                } else if (scrollPosition >= introTop && scrollPosition < introBottom) {
                    navbar.classList.remove('navbar-dark-text');
                } else if (scrollPosition >= servicesTop && scrollPosition < servicesBottom) {
                    navbar.classList.remove('navbar-dark-text');
                } else {
                    navbar.classList.remove('navbar-dark-text');
                }
            }
        }
    }

    const typewriter = document.getElementById('typewriter');
    if (typewriter) {
        const text = 'Grow Your Online Presence';
        let index = 0;

        function type() {
            if (index < text.length) {
                typewriter.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            } else {
                typewriter.style.animation = 'blink 0.7s step-end infinite';
            }
        }
        type();
    }

    const sections = document.querySelectorAll('.hosting-intro-section, .pay-for-hosting-section, .hosting-prices-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelector('.hosting-intro-card').classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    const slideCards = document.querySelectorAll('.slide-card, .plan-card');
    if (slideCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animation = entry.target.getAttribute('data-animation');
                    entry.target.classList.add(animation, 'visible');
                }
            });
        }, { threshold: 0.3 });

        slideCards.forEach(card => observer.observe(card));
    }

    function initStarfield() {
        const canvas = document.getElementById('three-canvas');
        if (!canvas) {
            return;
        }

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
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
        if (!stars1 || !stars2 || !stars3 || !starGeo1.attributes.position) {
            return;
        }

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

            if (positions1[idx] < -200) {
                positions1[idx] = 200;
                velocities1[i] = 0;
            }
            if (positions2[idx] < -200) {
                positions2[idx] = 200;
                velocities2[i] = 0;
            }
            if (positions3[idx] < -200) {
                positions3[idx] = 200;
                velocities3[i] = 0;
            }
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

    if (window.location.pathname.includes('index.html') || !window.location.pathname.includes('services.html')) {
        initStarfield();
    }

    window.addEventListener('scroll', updateNavbarColor);
    window.addEventListener('resize', updateNavbarColor);
    updateNavbarColor();
});