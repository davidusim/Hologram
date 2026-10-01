// Hologram Display System - Pepper's Ghost Implementation
// Based on the hologram_design.html specifications

let scene, renderer, composer;
let cameras = [];
let frustumSize = 100;
let aspect = window.innerWidth / window.innerHeight;
let clock = new THREE.Clock();

let isSpinning = true;
let lastTime = 0;
let frameCount = 0;
let fps = 0;

let objects = [];

// Initialize the hologram display
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
    document.getElementById('hologram-container').appendChild(renderer.domElement);

    // Create four cameras for the pyramid faces (0°, 90°, 180°, 270°)
    createCameras();

    // Create 3D objects
    createObjects();

    // Setup post-processing for distortion effect
    setupPostProcessing();

    // Setup event listeners
    setupEventListeners();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();
}

// Create the four cameras positioned around the Y-axis
function createCameras() {
    const radius = frustumSize; // Distance from center
    const height = frustumSize / 2; // Height at pyramid midline

    for (let i = 0; i < 4; i++) {
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2, // left
            frustumSize * aspect / 2,  // right
            frustumSize / 2,           // top
            frustumSize / -2,          // bottom
            0.1,                       // near
            1000                       // far
        );

        const angle = (i * Math.PI / 2); // 0, π/2, π, 3π/2
        camera.position.set(
            radius * Math.sin(angle),
            height,
            radius * Math.cos(angle)
        );
        camera.lookAt(0, height, 0); // Look at center of pyramid
        camera.up.set(0, 1, 0);
        cameras.push(camera);
    }
}

// Create 3D objects for the hologram display
function createObjects() {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Create a rotating tetrahedron (pyramid) as the main object
    const tetrahedronGeometry = new THREE.TetrahedronGeometry(15, 0);
    const tetrahedronMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x004040,
        specular: 0x001010,
        shininess: 30,
        flatShading: true
    });
    const tetrahedron = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterial);
    tetrahedron.position.set(0, 0, 0);
    scene.add(tetrahedron);
    objects.push({ mesh: tetrahedron, speed: 0.5 });

    // Create a floating cube
    const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0xff00ff,
        emissive: 0x400040,
        specular: 0x100010,
        shininess: 30
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-20, 5, 0);
    scene.add(cube);
    objects.push({ mesh: cube, speed: 0.3 });

    // Create a sphere
    const sphereGeometry = new THREE.SphereGeometry(8, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        emissive: 0x404000,
        specular: 0x101000,
        shininess: 30
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, -5, 0);
    scene.add(sphere);
    objects.push({ mesh: sphere, speed: 0.4 });

    // Add a particle system for background effects
    const particlesCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 200;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.5,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    objects.push({ mesh: particles, speed: 0.1 });
}

// Setup post-processing for the distortion effect
function setupPostProcessing() {
    // Create render targets for each camera view
    const renderTargetParameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
    };

    const width = Math.floor(window.innerWidth / 2);
    const height = Math.floor(window.innerHeight / 2);

    const renderTargets = [
        new THREE.WebGLRenderTarget(width, height, renderTargetParameters),
        new THREE.WebGLRenderTarget(width, height, renderTargetParameters),
        new THREE.WebGLRenderTarget(width, height, renderTargetParameters),
        new THREE.WebGLRenderTarget(width, height, renderTargetParameters)
    ];

    // Create EffectComposer
    composer = new THREE.EffectComposer(renderer);
    const renderPass = new THREE.RenderPass(scene, cameras[0]); // Will be updated per camera
    composer.addPass(renderPass);

    // Store render targets for use in render function
    composer.renderTargets = renderTargets;
}

// Setup event listeners for controls
function setupEventListeners() {
    document.getElementById('toggle-spin').addEventListener('click', () => {
        isSpinning = !isSpinning;
        document.getElementById('toggle-spin').textContent = isSpinning ? 'Pause Spin' : 'Resume Spin';
    });

    document.getElementById('reset-view').addEventListener('click', () => {
        // Reset object rotations
        objects.forEach(obj => {
            obj.mesh.rotation.set(0, 0, 0);
        });
    });

    document.getElementById('fullscreen-toggle').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });
}

// Handle window resize
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    aspect = width / height;

    // Update cameras
    cameras.forEach(camera => {
        camera.left = frustumSize * aspect / -2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = frustumSize / -2;
        camera.updateProjectionMatrix();
    });

    // Update renderer
    renderer.setSize(width, height);

    // Update render targets in composer
    if (composer && composer.renderTargets) {
        const renderTargetWidth = Math.floor(width / 2);
        const renderTargetHeight = Math.floor(height / 2);
        composer.renderTargets.forEach(rt => {
            rt.setSize(renderTargetWidth, renderTargetHeight);
        });
    }
}

// Update FPS counter
function updateFPS() {
    const now = performance.now();
    if (lastTime !== 0) {
        const delta = (now - lastTime) / 1000; // Convert to seconds
        if (delta > 0) {
            fps = Math.round(frameCount / delta);
            document.getElementById('fps-counter').textContent = fps;
        }
    }
    lastTime = now;
    frameCount = 0;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Update objects
    if (isSpinning) {
        objects.forEach(obj => {
            obj.mesh.rotation.y += obj.speed * delta;
            obj.mesh.rotation.x += obj.speed * 0.5 * delta;
            obj.mesh.rotation.z += obj.speed * 0.3 * delta;
        });

        // Slowly rotate particle system
        if (objects[3]) {
            objects[3].mesh.rotation.y += 0.1 * delta;
        }
    }

    // Render each camera view to its render target
    if (composer && composer.renderTargets) {
        composer.renderTargets.forEach((renderTarget, index) => {
            renderer.setRenderTarget(renderTarget);
            renderer.clear();
            renderer.render(scene, cameras[index]);
        });

        // Render to screen with distortion effect
        renderer.setRenderTarget(null);
        renderFinalImage();
    }

    // Update FPS counter every second
    frameCount++;
    if (performance.now() - lastTime >= 1000) {
        updateFPS();
        updateStatus();
    }
}

// Render the final image with four views arranged for the pyramid
function renderFinalImage() {
    // Save current state
    const currentRenderTarget = renderer.getRenderTarget();

    // Clear the renderer
    renderer.setRenderTarget(null);
    renderer.clear();

    // Get render targets
    const renderTargets = composer.renderTargets;
    const width = renderer.domElement.width;
    const height = renderer.domElement.height;
    const quarterWidth = Math.floor(width / 2);
    const quarterHeight = Math.floor(height / 2);

    // Define viewport positions for each camera view (arranged for pyramid)
    const viewports = [
        { x: quarterWidth, y: 0, width: quarterWidth, height: quarterHeight },           // Top-right
        { x: width, y: quarterHeight, width: quarterWidth, height: quarterHeight },      // Bottom-right
        { x: 0, y: quarterHeight, width: quarterWidth, height: quarterHeight },          // Bottom-left
        { x: quarterWidth, y: quarterHeight, width: quarterWidth, height: quarterHeight } // Top-left (overlapping for demo)
    ];

    // Actually, let's arrange them properly for a pyramid display:
    // Top-left: Camera 0 (0°)
    // Top-right: Camera 1 (90°)
    // Bottom-left: Camera 2 (180°)
    // Bottom-right: Camera 3 (270°)
    const properViewports = [
        { x: 0, y: 0, width: quarterWidth, height: quarterHeight },           // Top-left
        { x: quarterWidth, y: 0, width: quarterWidth, height: quarterHeight }, // Top-right
        { x: 0, y: quarterHeight, width: quarterWidth, height: quarterHeight }, // Bottom-left
        { x: quarterWidth, y: quarterHeight, width: quarterWidth, height: quarterHeight } // Bottom-right
    ];

    // Render each view to its viewport
    properViewports.forEach((viewport, index) => {
        renderer.viewport = new THREE.Vector4(viewport.x, viewport.y, viewport.width, viewport.height);
        renderer.scissor = new THREE.Vector4(viewport.x, viewport.y, viewport.width, viewport.height);
        renderer.scissorTest = true;

        // Clear this viewport
        renderer.clearColor(0x000000, 0);

        // Render the scene with the corresponding camera to this viewport
        renderer.render(scene, cameras[index]);

        renderer.scissorTest = false;
    });

    // Reset viewport and scissor
    renderer.viewport = new THREE.Vector4(0, 0, width, height);
    renderer.scissor = new THREE.Vector4(0, 0, width, height);

    // Restore original render target
    renderer.setRenderTarget(currentRenderTarget);
}

// Update status indicator
function updateStatus() {
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');

    if (renderer.info.render.frame > 0) {
        statusIndicator.className = 'status-indicator status-active';
        statusText.textContent = 'Active';
    } else {
        statusIndicator.className = 'status-indicator status-inactive';
        statusText.textContent = 'Inactive';
    }
}

// Initialize when the window loads
window.addEventListener('load', init);