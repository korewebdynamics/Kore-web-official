document.addEventListener('DOMContentLoaded', () => {
    // --- TYPEWRITER FOR BANNER ---
    const bannerElement = document.getElementById('web-dev-banner');
    const typewriterElement = document.getElementById('banner-typewriter');
    
    if (bannerElement && typewriterElement) {
        let hasAnimated = false; 
        const runTypewriterAnimation = () => {
            if (hasAnimated) return; 
            hasAnimated = true;
            const textToType = "Unique Designs. Powerful Results.";
            let currentIndex = 0;
            typewriterElement.textContent = ''; 
            const typeCharacter = () => {
                if (currentIndex < textToType.length) {
                    typewriterElement.textContent += textToType.charAt(currentIndex);
                    currentIndex++;
                    setTimeout(typeCharacter, 120); 
                } else {
                    typewriterElement.classList.add('typing-done');
                }
            };
            typeCharacter(); 
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runTypewriterAnimation();
                    observer.unobserve(bannerElement); 
                }
            });
        }, { threshold: 0.5 }); 
        observer.observe(bannerElement);
    }

    // --- 3D CHATBOT MODEL ---
    const initChatbotModel = () => {
        const canvas = document.querySelector('#chatbot-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antiaslias: true });
        const container = canvas.parentElement;
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputEncoding = THREE.sRGBEncoding;

        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 10); 

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        const modelGroup = new THREE.Group();
        scene.add(modelGroup);

        const loader = new THREE.GLTFLoader();

        loader.load(
            'images/chatbot-image/source/Chatbot_v011.glb',
            (gltf) => {
                const chatbotModel = gltf.scene;
                
                chatbotModel.rotation.x = Math.PI / 2;
                chatbotModel.scale.set(14, 14, 14); 
                
                
                chatbotModel.position.y = -1.5;
                
                modelGroup.add(chatbotModel);
            },
            undefined,
            (error) => {
                console.error('An error happened while loading the 3D model:', error);
            }
        );

        const animate = () => {
            requestAnimationFrame(animate);

            modelGroup.rotation.y += 0.005;

            renderer.render(scene, camera);
        };
        animate();

        const onWindowResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', onWindowResize);
    };

    initChatbotModel();
});