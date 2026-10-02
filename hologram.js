// Hologram Display System - Enhanced Customizable Pepper's Ghost Implementation
// Maintains cyan/black aesthetic with extensive customization options

// ===== CONFIGURATION OBJECT - EASILY CUSTOMIZABLE =====
const CONFIG = {
    // === VISUAL THEME (MAINTAIN CYAN/BLACK) ===
    theme: {
        background: 0x000000,           // Pure black background
        ambientLightColor: 0x404040,    // Dim gray ambient light
        ambientLightIntensity: 0.4,
        primaryColor: 0x00ffff,         // Bright cyan (main accent)
        secondaryColors: [              // Complementary colors for variety
            0xff00ff,   // Magenta
            0xffff00,   // Yellow
            0x00ff00,   // Green
            0xff8800,   // Orange
            0x8800ff    // Purple
        ],
        emissiveMultiplier: 0.25,       // Emissive brightness
        specularColor: 0x080808,        // Dark specular highlights
        shininess: 25                   // Material shininess
    },

    // === FRUSTUM / CAMERA SETTINGS ===
    frustum: {
        size: 100,                      // Frustum size (affects view angle)
        cameraDistance: 100,            // Distance from origin to cameras
        cameraHeight: 50                // Camera height (pyramid midline)
    },

    // === OBJECT DEFINITIONS ===
    objects: {
        // Primary tetrahedron (pyramid shape)
        tetrahedron: {
            enabled: true,
            size: 16,
            speed: { rotation: 0.3, pulse: 1.2, orbit: 0.15 },
            position: { x: 0, y: 0, z: 0 },
            colorIndex: 0,              // Primary cyan color
            pulse: true,                // Enable pulsing/scale animation
            orbit: true,                // Enable orbital motion
            orbitRadius: 0,             // No orbit (stays centered)
            wave: true                  // Enable wave deformation
        },

        // Secondary cube objects
        cube: {
            enabled: true,
            count: 2,
            size: 10,
            speed: { rotation: 0.25, pulse: 1.0, orbit: 0.2 },
            position: { x: -18, y: 6, z: 0 },
            colorIndex: 1,              // Magenta
            pulse: true,
            orbit: true,
            orbitRadius: 12,
            wave: false
        },

        // Tertiary sphere objects
        sphere: {
            enabled: true,
            count: 2,
            size: 8,
            speed: { rotation: 0.28, pulse: 1.1, orbit: 0.18 },
            position: { x: 18, y: -6, z: 0 },
            colorIndex: 2,              // Yellow
            pulse: true,
            orbit: true,
            orbitRadius: 15,
            wave: true
        },

        // Octahedron (diamond shape)
        octahedron: {
            enabled: true,
            size: 12,
            speed: { rotation: 0.22, pulse: 0.9, orbit: 0.25 },
            position: { x: 0, y: 16, z: 0 },
            colorIndex: 3,              // Orange
            pulse: true,
            orbit: true,
            orbitRadius: 8,
            wave: false
        },

        // Torus knot (complex shape)
        torusKnot: {
            enabled: true,
            size: 9,
            speed: { rotation: 0.18, pulse: 1.3, orbit: 0.22 },
            position: { x: 0, y: -16, z: 0 },
            colorIndex: 4,              // Purple
            pulse: true,
            orbit: true,
            orbitRadius: 10,
            wave: true
        }
    },

    // === PARTICLE SYSTEM ===
    particles: {
        enabled: true,
        count: 600,
        size: 0.5,
        color: 0x00ffff,                // Cyan particles
        opacity: 0.5,
        speed: 0.03,                    // Slow rotation
        spread: 180,                    // Spatial spread
        pulse: true                     // Collective pulsing
    },

    // === ANIMATION SETTINGS ===
    animation: {
        globalSpeed: 1.0,               // Overall speed multiplier
        enablePulse: true,              // Master pulse control
        enableOrbit: true,              // Master orbit control
        enableWave: true,               // Master wave control
        enablePostProcessing: true,     // Enable bloom/glare effects
        enableInteraction: true,        // Enable mouse/keyboard interaction
        enableAutoPilot: true,          // Automatic parameter cycling
        autoPilotCycleTime: 20          // Seconds for full parameter cycle
    },

    // === POST-PROCESSING EFFECTS ===
    postProcessing: {
        bloom: {
            enabled: true,
            strength: 1.4,              // Bloom intensity
            radius: 0.35,               // Bloom radius
            threshold: 0.75             // Bloom threshold
        }
    },

    // === INTERACTION SETTINGS ===
    interaction: {
        mouseSensitivity: 0.12,         // Mouse look sensitivity
        clickToSpawn: true,             // Click to spawn temporary effects
        clickSpawnCount: 12,            // Particles per click
        keyboardControls: true,         // Enable keyboard shortcuts
        resetOnDoubleClick: true,       // Reset on double-click
        allowFullscreen: true,          // Allow fullscreen toggle
        showDebugInfo: false            // Show FPS/status (handled separately)
    }
};

// ===== GLOBAL VARIABLES =====
let scene, renderer, composer;
let cameras = [];
let clock = new THREE.Clock();
let objects = [];                       // Main 3D objects array
let particleSystem = null;              // Particle system
let autoPilotTime = 0;                  // Timer for auto-pilot cycling

// Interaction tracking
let interactionState = {
    mouseX: 0,
    mouseY: 0,
    isMouseDown: false,
    lastClickTime: 0
};

// ===== INITIALIZATION =====
function init() {
    // Create scene with slight fog for depth
    scene = new THREE.Scene();
    scene.background = new THREE.Color(CONFIG.theme.background);
    scene.fog = new THREE.FogExp2(CONFIG.theme.background, 0.0003);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('hologram-container').appendChild(renderer.domElement);

    // Setup four cameras for pyramid faces
    createCameras();

    // Create 3D objects based on config
    createObjects();

    // Setup particle system
    createParticleSystem();

    // Setup post-processing effects
    setupPostProcessing();

    // Setup event listeners
    setupEventListeners();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();
}

// ===== CAMERA SETUP =====
function createCameras() {
    const radius = CONFIG.frustum.cameraDistance;
    const height = CONFIG.frustum.cameraHeight;

    for (let i = 0; i < 4; i++) {
        const camera = new THREE.OrthographicCamera(
            CONFIG.frustum.size * aspect / -2, // left
            CONFIG.frustum.size * aspect / 2,  // right
            CONFIG.frustum.size / 2,           // top
            CONFIG.frustum.size / -2,          // bottom
            0.1,                               // near
            1000                               // far
        );

        const angle = (i * Math.PI / 2); // 0, π/2, π, 3π/2
        camera.position.set(
            radius * Math.sin(angle),
            height,
            radius * Math.cos(angle)
        );
        camera.lookAt(0, height, 0); // Look at pyramid center
        camera.up.set(0, 1, 0);
        cameras.push(camera);
    }
}

// ===== HELPER FUNCTIONS =====
function getColorByIndex(index) {
    if (index === 0) return CONFIG.theme.primaryColor;
    return CONFIG.theme.secondaryColors[(index - 1) % CONFIG.theme.secondaryColors.length];
}

function getEmissiveColor(baseColor) {
    // Create a darker version for emissive glow
    const r = ((baseColor >> 16) & 0xff) / 255;
    const g = ((baseColor >> 8) & 0xff) / 255;
    const b = (baseColor & 0xff) / 255;
    const factor = CONFIG.theme.emissiveMultiplier;
    return new THREE.Color(
        Math.min(1, r * factor),
        Math.min(1, g * factor),
        Math.min(1, b * factor)
    );
}

// ===== OBJECT CREATION =====
function createObjects() {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(
        CONFIG.theme.ambientLightColor,
        CONFIG.theme.ambientLightIntensity
    );
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(
        CONFIG.theme.primaryColor,
        0.8
    );
    directionalLight.position.set(4, 8, 6);
    scene.add(directionalLight);

    // Create tetrahedron
    if (CONFIG.objects.tetrahedron.enabled) {
        createTetrahedron();
    }

    // Create cubes
    if (CONFIG.objects.cube.enabled) {
        createMultipleObjects('cube', CONFIG.objects.cube);
    }

    // Create spheres
    if (CONFIG.objects.sphere.enabled) {
        createMultipleObjects('sphere', CONFIG.objects.sphere);
    }

    // Create octahedron
    if (CONFIG.objects.octahedron.enabled) {
        createOctahedron();
    }

    // Create torus knot
    if (CONFIG.objects.torusKnot.enabled) {
        createTorusKnot();
    }
}

function createTetrahedron() {
    const obj = CONFIG.objects.tetrahedron;
    const geometry = new THREE.TetrahedronGeometry(obj.size, 0);
    const material = new THREE.MeshPhongMaterial({
        color: getColorByIndex(obj.colorIndex),
        emissive: getEmissiveColor(getColorByIndex(obj.colorIndex)),
        specular: CONFIG.theme.specularColor,
        shininess: CONFIG.theme.shininess,
        flatShading: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
    mesh.originalPosition = mesh.position.clone();
    scene.add(mesh);
    objects.push({
        mesh: mesh,
        type: 'tetrahedron',
        config: obj,
        speed: {
            rotation: obj.speed.rotation * CONFIG.animation.globalSpeed,
            pulse: obj.speed.pulse * CONFIG.animation.globalSpeed,
            orbit: obj.speed.orbit * CONFIG.animation.globalSpeed
        },
        pulseOffset: Math.random() * Math.PI * 2,
        orbitAngle: Math.random() * Math.PI * 2,
        waveTime: Math.random() * Math.PI * 2,
        originalScale: new THREE.Vector3(1, 1, 1),
        originalPosition: mesh.position.clone()
    });
}

function createMultipleObjects(type, config) {
    for (let i = 0; i < config.count; i++) {
        let geometry, material;
        const basePos = config.position;

        if (type === 'cube') {
            geometry = new THREE.BoxGeometry(config.size, config.size, config.size);
            material = new THREE.MeshPhongMaterial({
                color: getColorByIndex(config.colorIndex),
                emissive: getEmissiveColor(getColorByIndex(config.colorIndex)),
                specular: CONFIG.theme.specularColor,
                shininess: CONFIG.theme.shininess
            });
        } else if (type === 'sphere') {
            geometry = new THREE.SphereGeometry(config.size, 24, 24);
            material = new THREE.MeshPhongMaterial({
                color: getColorByIndex(config.colorIndex),
                emissive: getEmissiveColor(getColorByIndex(config.colorIndex)),
                specular: CONFIG.theme.specularColor,
                shininess: CONFIG.theme.shininess
            });
        }

        const mesh = new THREE.Mesh(geometry, material);

        // Stagger positions for multiple instances
        const offset = new THREE.Vector3(
            (i - config.count/2 + 0.5) * config.size * 0.8,
            (i - config.count/2 + 0.5) * config.size * 0.8,
            0
        );
        mesh.position.set(
            basePos.x + offset.x,
            basePos.y + offset.y,
            basePos.z + offset.z
        );
        mesh.originalPosition = mesh.position.clone();

        scene.add(mesh);
        objects.push({
            mesh: mesh,
            type: type,
            config: config,
            speed: {
                rotation: config.speed.rotation * CONFIG.animation.globalSpeed,
                pulse: config.speed.pulse * CONFIG.animation.globalSpeed,
                orbit: config.speed.orbit * CONFIG.animation.globalSpeed
            },
            pulseOffset: Math.random() * Math.PI * 2,
            orbitAngle: Math.random() * Math.PI * 2,
            waveTime: Math.random() * Math.PI * 2,
            originalScale: new THREE.Vector3(1, 1, 1),
            originalPosition: mesh.position.clone()
        });
    }
}

function createOctahedron() {
    const obj = CONFIG.objects.octahedron;
    const geometry = new THREE.OctahedronGeometry(obj.size, 0);
    const material = new THREE.MeshPhongMaterial({
        color: getColorByIndex(obj.colorIndex),
        emissive: getEmissiveColor(getColorByIndex(obj.colorIndex)),
        specular: CONFIG.theme.specularColor,
        shininess: CONFIG.theme.shininess
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
    mesh.originalPosition = mesh.position.clone();
    scene.add(mesh);
    objects.push({
        mesh: mesh,
        type: 'octahedron',
        config: obj,
        speed: {
            rotation: obj.speed.rotation * CONFIG.animation.globalSpeed,
            pulse: obj.speed.pulse * CONFIG.animation.globalSpeed,
            orbit: obj.speed.orbit * CONFIG.animation.globalSpeed
        },
        pulseOffset: Math.random() * Math.PI * 2,
        orbitAngle: Math.random() * Math.PI * 2,
        waveTime: Math.random() * Math.PI * 2,
        originalScale: new THREE.Vector3(1, 1, 1),
        originalPosition: mesh.position.clone()
    });
}

function createTorusKnot() {
    const obj = CONFIG.objects.torusKnot;
    const geometry = new THREE.TorusKnotGeometry(obj.size, obj.size/3, 100, 16);
    const material = new THREE.MeshPhongMaterial({
        color: getColorByIndex(obj.colorIndex),
        emissive: getEmissiveColor(getColorByIndex(obj.colorIndex)),
        specular: CONFIG.theme.specularColor,
        shininess: CONFIG.theme.shininess
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
    mesh.originalPosition = mesh.position.clone();
    scene.add(mesh);
    objects.push({
        mesh: mesh,
        type: 'torusKnot',
        config: obj,
        speed: {
            rotation: obj.speed.rotation * CONFIG.animation.globalSpeed,
            pulse: obj.speed.pulse * CONFIG.animation.globalSpeed,
            orbit: obj.speed.orbit * CONFIG.animation.globalSpeed
        },
        pulseOffset: Math.random() * Math.PI * 2,
        orbitAngle: Math.random() * Math.PI * 2,
        waveTime: Math.random() * Math.PI * 2,
        originalScale: new THREE.Vector3(1, 1, 1),
        originalPosition: mesh.position.clone()
    });
}

// ===== PARTICLE SYSTEM =====
function createParticleSystem() {
    if (!CONFIG.particles.enabled) return;

    const p = CONFIG.particles;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(p.count * 3);
    const colors = new Float32Array(p.count * 3);
    const sizes = new Float32Array(p.count);

    const color = new THREE.Color(p.color);

    for (let i = 0; i < p.count; i++) {
        // Random positions in 3D space
        positions[i * 3 + 0] = (Math.random() - 0.5) * p.spread;
        positions[i * 3 + 1] = (Math.random() - 0.5) * p.spread;
        positions[i * 3 + 2] = (Math.random() - 0.5) * p.spread;

        // Particle colors with slight variation
        colors[i * 3 + 0] = color.r + (Math.random() - 0.5) * 0.1;
        colors[i * 3 + 1] = color.g + (Math.random() - 0.5) * 0.1;
        colors[i * 3 + 2] = color.b + (Math.random() - 0.5) * 0.1;

        // Random sizes
        sizes[i] = p.size + (Math.random() - 0.5) * p.size * 0.3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            scale: { value: 1.0 }
        },
        vertexShader: `
            uniform float time;
            uniform float scale;
            attribute vec3 color;
            attribute float size;
            varying vec3 vColor;
            varying float vSize;
            void main() {
                vColor = color;
                vSize = size * scale;
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                gl_PointSize = vSize * ( 300.0 / -mvPosition.z );
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            varying float vSize;
            void main() {
                float dist = distance(gl_PointCoord, vec2(0.5));
                float alpha = 1.0 - smoothstep(0.1, 0.4, dist);
                if (alpha <= 0.0) discard;
                gl_FragColor = vec4(vColor, alpha * 0.8);
            }
        `,
        transparent: true,
        depthTest: false
    });

    particleSystem = new THREE.Points(geometry, material);
    particleSystem.originalPositions = positions.slice();
    particleSystem.baseSizes = sizes.slice();
    scene.add(particleSystem);
}

// ===== POST-PROCESSING =====
function setupPostProcessing() {
    if (!CONFIG.animation.enablePostProcessing) return;

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
    const renderPass = new THREE.RenderPass(scene, cameras[0]); // Updated per camera
    composer.addPass(renderPass);

    // Add bloom effect
    if (CONFIG.postProcessing.bloom.enabled) {
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            CONFIG.postProcessing.bloom.strength,
            CONFIG.postProcessing.bloom.radius,
            CONFIG.postProcessing.bloom.threshold
        );
        composer.addPass(bloomPass);
    }

    // Store render targets
    composer.renderTargets = renderTargets;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    const container = document.getElementById('hologram-container');

    document.getElementById('toggle-spin').addEventListener('click', () => {
        CONFIG.animation.globalSpeed = CONFIG.animation.globalSpeed === 0 ? 1 : 0;
        document.getElementById('toggle-spin').textContent =
            CONFIG.animation.globalSpeed === 0 ? 'Resume Animation' : 'Pause Animation';
    });

    document.getElementById('reset-view').addEventListener('click', () => {
        // Reset all objects to initial state
        objects.forEach(obj => {
            obj.mesh.rotation.set(0, 0, 0);
            obj.mesh.position.copy(obj.originalPosition);
            obj.mesh.scale.copy(obj.originalScale);
            obj.orbitAngle = 0;
            obj.waveTime = 0;
            obj.pulseOffset = Math.random() * Math.PI * 2; // Randomize pulse offset
        });
        if (particleSystem) {
            // Reset particle system
            const positions = particleSystem.geometry.attributes.position.array;
            const original = particleSystem.originalPositions;
            const sizes = particleSystem.geometry.attributes.size.array;
            const baseSizes = particleSystem.baseSizes;

            for (let i = 0; i < positions.length; i++) {
                positions[i] = original[i];
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;

            for (let i = 0; i < sizes.length; i++) {
                sizes[i] = baseSizes[i];
            }
            particleSystem.geometry.attributes.size.needsUpdate = true;
        }
    });

    document.getElementById('fullscreen-toggle').addEventListener('click', () => {
        if (!document.fullscreenElement && CONFIG.interaction.allowFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Fullscreen error: ${err.message}`);
            });
        } else if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    });

    // Mouse interactions
    if (CONFIG.interaction.enableInteraction) {
        container.addEventListener('mousemove', (event) => {
            const rect = container.getBoundingClientRect();
            interactionState.mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            interactionState.mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        });

        container.addEventListener('mousedown', () => {
            interactionState.isMouseDown = true;
            interactionState.lastClickTime = performance.now();
        });

        container.addEventListener('mouseup', (event) => {
            interactionState.isMouseDown = false;
            const now = performance.now();

            // Double-click reset
            if (now - interactionState.lastClickTime < 300 && CONFIG.interaction.resetOnDoubleClick) {
                document.getElementById('reset-view').click();
            }
            interactionState.lastClickTime = now;

            // Click-to-spawn particles
            if (CONFIG.interaction.clickToSpawn && event.button === 0) {
                spawnClickParticles(event);
            }
        });

        // Touch support for mobile devices
        container.addEventListener('touchstart', (event) => {
            event.preventDefault();
            if (event.touches.length === 1) {
                const touch = event.touches[0];
                const rect = container.getBoundingClientRect();
                interactionState.mouseX = ((touch.clientX - rect.left) / rect.width - 0.5) * 2;
                interactionState.mouseY = ((touch.clientY - rect.top) / rect.height - 0.5) * 2;
                interactionState.isMouseDown = true;
                interactionState.lastClickTime = performance.now();
            }
        });

        container.addEventListener('touchmove', (event) => {
            event.preventDefault();
            if (event.touches.length === 1) {
                const touch = event.touches[0];
                const rect = container.getBoundingClientRect();
                interactionState.mouseX = ((touch.clientX - rect.left) / rect.width - 0.5) * 2;
                interactionState.mouseY = ((touch.clientY - rect.top) / rect.height - 0.5) * 2;
            }
        });

        container.addEventListener('touchend', () => {
            interactionState.isMouseDown = false;
        });
    }

    // Keyboard controls
    if (CONFIG.interaction.keyboardControls) {
        document.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            switch (key) {
                case ' ':
                    // Spacebar - toggle animation
                    CONFIG.animation.globalSpeed = CONFIG.animation.globalSpeed === 0 ? 1 : 0;
                    document.getElementById('toggle-spin').textContent =
                        CONFIG.animation.globalSpeed === 0 ? 'Resume Animation' : 'Pause Animation';
                    break;
                case 'r':
                    // R - reset view
                    document.getElementById('reset-view').click();
                    break;
                case 'f':
                    // F - fullscreen toggle
                    document.getElementById('fullscreen-toggle').click();
                    break;
                case '1':
                    toggleObjectVisibility('tetrahedron');
                    break;
                case '2':
                    toggleObjectVisibility('cube');
                    break;
                case '3':
                    toggleObjectVisibility('sphere');
                    break;
                case '4':
                    toggleObjectVisibility('octahedron');
                    break;
                case '5':
                    toggleObjectVisibility('torusKnot');
                    break;
                case 'p':
                    toggleParticles();
                    break;
                case 'b':
                    toggleBloom();
                    break;
                case '+':
                    increaseGlobalSpeed();
                    break;
                case '-':
                    decreaseGlobalSpeed();
                    break;
                case 'a':
                    toggleAutoPilot();
                    break;
                case 'c':
                    cycleObjectColors();
                    break;
            }
        });
    }
}

// ===== INTERACTION HELPERS =====
function toggleObjectVisibility(type) {
    objects.forEach(obj => {
        if (obj.type === type) {
            obj.mesh.visible = !obj.mesh.visible;
        }
    });
}

function toggleParticles() {
    if (particleSystem) {
        particleSystem.visible = !particleSystem.visible;
    }
}

function toggleBloom() {
    if (composer && composer.passes.length > 1) {
        const bloomPass = composer.passes[composer.passes.length - 1];
        if (bloomPass instanceof THREE.UnrealBloomPass) {
            bloomPass.enabled = !bloomPass.enabled;
        }
    }
}

function increaseGlobalSpeed() {
    CONFIG.animation.globalSpeed = Math.min(3, CONFIG.animation.globalSpeed + 0.2);
}

function decreaseGlobalSpeed() {
    CONFIG.animation.globalSpeed = Math.max(0.2, CONFIG.animation.globalSpeed - 0.2);
}

function toggleAutoPilot() {
    CONFIG.animation.enableAutoPilot = !CONFIG.animation.enableAutoPilot;
    if (!CONFIG.animation.enableAutoPilot) {
        autoPilotTime = 0;
    }
}

function cycleObjectColors() {
    // Cycle through color presets while maintaining cyan/black base
    const first = CONFIG.theme.secondaryColors.shift();
    CONFIG.theme.secondaryColors.push(first);
}

// ===== RESIZE HANDLER =====
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    aspect = width / height;

    // Update all cameras
    cameras.forEach(camera => {
        camera.left = CONFIG.frustum.size * aspect / -2;
        camera.right = CONFIG.frustum.size * aspect / 2;
        camera.top = CONFIG.frustum.size / 2;
        camera.bottom = CONFIG.frustum.size / -2;
        camera.updateProjectionMatrix();
    });

    // Update renderer
    renderer.setSize(width, height);

    // Update render targets
    if (composer && composer.renderTargets) {
        const renderTargetWidth = Math.floor(width / 2);
        const renderTargetHeight = Math.floor(height / 2);
        composer.renderTargets.forEach(rt => {
            rt.setSize(renderTargetWidth, renderTargetHeight);
        });

        // Update bloom pass if present
        if (composer.passes.length > 1) {
            const bloomPass = composer.passes[composer.passes.length - 1];
            if (bloomPass instanceof THREE.UnrealBloomPass) {
                bloomPass.setSize(width, height);
            }
        }
    }
}

// ===== UPDATE FUNCTIONS =====
function updateFPS() {
    const now = performance.now();
    if (lastTime !== 0) {
        const delta = (now - lastTime) / 1000;
        if (delta > 0) {
            fps = Math.round(frameCount / delta);
            document.getElementById('fps-counter').textContent = fps;
        }
    }
    lastTime = now;
    frameCount = 0;
}

function updateStatus() {
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');

    if (renderer && renderer.info && renderer.info.render && renderer.info.render.frame > 0) {
        statusIndicator.className = 'status-indicator status-active';
        statusText.textContent = 'Active';
    } else {
        statusIndicator.className = 'status-indicator status-inactive';
        statusText.textContent = 'Inactive';
    }
}

// ===== CLICK-TO-SPAWN PARTICLES =====
function spawnClickParticles(event) {
    if (!CONFIG.interaction.clickToSpawn || !particleSystem) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    // Temporarily modify existing particles for performance
    const positions = particleSystem.geometry.attributes.position.array;
    const colors = particleSystem.geometry.attributes.color.array;
    const sizes = particleSystem.geometry.attributes.size.array;
    const baseSizes = particleSystem.baseSizes.slice();

    const count = Math.min(CONFIG.interaction.clickSpawnCount, positions.length / 3);

    for (let i = 0; i < count; i++) {
        const particleIndex = Math.floor(Math.random() * positions.length / 3);
        const baseIndex = particleIndex * 3;

        // Displace particles toward click position
        positions[baseIndex] += x * 0.15;
        positions[baseIndex + 1] += y * 0.15;
        positions[baseIndex + 2] += 0; // Z unchanged for 2D click

        // Make particles bright and larger
        colors[baseIndex] = 1.0;
        colors[baseIndex + 1] = 1.0;
        colors[baseIndex + 2] = 1.0;
        sizes[baseIndex] = baseSizes[baseIndex] * CONFIG.interaction.clickSpawnCount * 0.1;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.geometry.attributes.color.needsUpdate = true;
    particleSystem.geometry.attributes.size.needsUpdate = true;

    // Reset after delay
    setTimeout(() => {
        for (let i = 0; i < count; i++) {
            const particleIndex = Math.floor(Math.random() * positions.length / 3);
            const baseIndex = particleIndex * 3;

            // Reset position
            positions[baseIndex] = particleSystem.originalPositions[baseIndex];
            positions[baseIndex + 1] = particleSystem.originalPositions[baseIndex + 1];
            positions[baseIndex + 2] = particleSystem.originalPositions[baseIndex + 2];

            // Reset color to original cyan with variation
            const baseColor = new THREE.Color(CONFIG.particles.color);
            colors[baseIndex] = baseColor.r + (Math.random() - 0.5) * 0.1;
            colors[baseIndex + 1] = baseColor.g + (Math.random() - 0.5) * 0.1;
            colors[baseIndex + 2] = baseColor.b + (Math.random() - 0.5) * 0.1;

            // Reset size
            sizes[baseIndex] = baseSizes[baseIndex];
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.geometry.attributes.color.needsUpdate = true;
        particleSystem.geometry.attributes.size.needsUpdate = true;
    }, 800); // Reset after 0.8 seconds
}

// ===== MAIN ANIMATION LOOP =====
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta() * CONFIG.animation.globalSpeed;
    const time = performance.now() * 0.001; // Time in seconds

    // Update auto-pilot parameters if enabled
    if (CONFIG.animation.enableAutoPilot) {
        autoPilotTime += delta;
        if (autoPilotTime > CONFIG.animation.autoPilotCycleTime) {
            autoPilotTime = 0;
        }

        const cyclePos = autoPilotTime / CONFIG.animation.autoPilotCycleTime; // 0 to 1
        const cycleWave = Math.sin(cyclePos * Math.PI * 2); // -1 to 1 sine wave

        // Modulate pulse intensity
        CONFIG.animation.pulseIntensity = 0.1 + (cycleWave * 0.3 + 0.3) * 0.3; // 0.1 to 0.4

        // Modulate orbit speed
        CONFIG.animation.orbitSpeed = 0.05 + (cycleWave * 0.3 + 0.3) * 0.25; // 0.05 to 0.3

        // Modulate global speed
        CONFIG.animation.globalSpeed = 0.5 + (cycleWave * 0.3 + 0.3) * 1.0; // 0.5 to 1.5

        // Modulate bloom strength
        CONFIG.postProcessing.bloom.strength = 0.5 + (cycleWave * 0.3 + 0.3) * 2.0; // 0.5 to 2.5
    }

    // Update all 3D objects
    objects.forEach((obj, index) => {
        const objConfig = obj.config;

        // Base rotation (smooth, continuous)
        obj.mesh.rotation.y += obj.speed.rotation * delta;
        obj.mesh.rotation.x += obj.speed.rotation * 0.4 * delta; // Slightly slower on x
        obj.mesh.rotation.z += obj.speed.rotation * 0.3 * delta; // Slightly slower on z

        // Pulsing animation (scale oscillation)
        if (obj.speed.pulse > 0 && CONFIG.animation.enablePulse) {
            const pulseScale = 1 + Math.sin(time * obj.speed.pulse + obj.pulseOffset) *
                             (obj.config.pulseIntensity || 0.2);
            obj.mesh.scale.set(
                obj.originalScale.x * pulseScale,
                obj.originalScale.y * pulseScale,
                obj.originalScale.z * pulseScale
            );
        } else {
            // Maintain original scale if pulsing disabled
            obj.mesh.scale.copy(obj.originalScale);
        }

        // Orbital motion
        if (obj.speed.orbit > 0 && CONFIG.animation.enableOrbit && obj.config.orbitRadius > 0) {
            obj.orbitAngle += obj.speed.orbit * delta;
            const offsetX = Math.cos(obj.orbitAngle) * obj.config.orbitRadius;
            const offsetZ = Math.sin(obj.orbitAngle) * obj.config.orbitRadius;
            obj.mesh.position.set(
                obj.originalPosition.x + offsetX,
                obj.originalPosition.y,
                obj.originalPosition.z + offsetZ
            );
        }

        // Wave deformation (vertex displacement)
        if (obj.config.wave && CONFIG.animation.enableWave) {
            const positionAttribute = obj.mesh.geometry.attributes.position;
            if (positionAttribute && positionAttribute.count > 0) {
                const waveTime = time * 0.3 + obj.waveTime;
                const waveHeight = 0.3; // Max wave displacement

                for (let i = 0; i < positionAttribute.count; i++) {
                    const x = positionAttribute.getX(i);
                    const y = positionAttribute.getY(i);
                    const z = positionAttribute.getZ(i);

                    // Create radial wave effect
                    const distFromCenter = Math.sqrt(x*x + z*z) / obj.config.size;
                    const waveOffset = Math.sin(distFromCenter * 3 - waveTime) * waveHeight *
                                     (1 - distFromCenter); // Stronger at center, weaker at edges

                    positionAttribute.setY(i, y + waveOffset);
                }
                positionAttribute.needsUpdate = true;
                obj.waveTime += delta * 0.2;
            }
        }

        // Subtle mouse interaction (gentle follow)
        if (CONFIG.interaction.enableInteraction) {
            const mouseInfluence = 0.05; // How much mouse affects objects
            const tiltX = interactionState.mouseX * mouseInfluence;
            const tiltY = interactionState.mouseY * mouseInfluence;

            // Apply as subtle additional rotation (damped over time)
            obj.mesh.rotation.x += tiltY * CONFIG.animation.globalSpeed * delta * 0.1;
            obj.mesh.rotation.y += tiltX * CONFIG.animation.globalSpeed * delta * 0.1;
        }
    });

    // Update particle system
    if (particleSystem && CONFIG.particles.enabled) {
        // Slow overall rotation
        particleSystem.rotation.y += CONFIG.particles.speed * delta;

        // Collective pulsing
        if (CONFIG.particles.pulse && CONFIG.animation.enablePulse) {
            const pulseScale = 1 + Math.sin(time * 0.5) * 0.15;
            particleSystem.scale.set(pulseScale, pulseScale, pulseScale);
        }

        // Optional: slight drift or flow
        if (CONFIG.particles.enabled) {
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                // Very slow Brownian motion-like drift
                positions[i] += (Math.random() - 0.5) * 0.001;
                positions[i+1] += (Math.random() - 0.5) * 0.001;
                positions[i+2] += (Math.random() - 0.5) * 0.001;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
        }
    }

    // Render each camera view to its render target
    if (composer && composer.renderTargets) {
        composer.renderTargets.forEach((renderTarget, index) => {
            renderer.setRenderTarget(renderTarget);
            renderer.clear();
            renderer.render(scene, cameras[index]);
        });

        // Render final composited image to screen
        renderer.setRenderTarget(null);
        renderFinalImage();
    }

    // Update statistics
    frameCount++;
    if (performance.now() - lastTime >= 1000) {
        updateFPS();
        updateStatus();
    }
}

// ===== FINAL IMAGE RENDERING =====
function renderFinalImage() {
    // Preserve current render target
    const currentRenderTarget = renderer.getRenderTarget();

    // Clear to transparent black
    renderer.setRenderTarget(null);
    renderer.clear();

    // Get render targets from composer
    const renderTargets = composer.renderTargets;
    const width = renderer.domElement.width;
    const height = renderer.domElement.height;
    const quarterWidth = Math.floor(width / 2);
    const quarterHeight = Math.floor(height / 2);

    // Define viewport layout for pyramid viewing
    // Arrange as: [Top-left, Top-right]
    //             [Bottom-left, Bottom-right]
    const viewports = [
        { x: 0, y: 0, width: quarterWidth, height: quarterHeight },           // Top-left
        { x: quarterWidth, y: 0, width: quarterWidth, height: quarterHeight }, // Top-right
        { x: 0, y: quarterHeight, width: quarterWidth, height: quarterHeight }, // Bottom-left
        { x: quarterWidth, y: quarterHeight, width: quarterWidth, height: quarterHeight } // Bottom-right
    ];

    // Render each camera view to its respective viewport
    viewports.forEach((viewport, index) => {
        renderer.viewport = new THREE.Vector4(
            viewport.x, viewport.y, viewport.width, viewport.height
        );
        renderer.scissor = new THREE.Vector4(
            viewport.x, viewport.y, viewport.width, viewport.height
        );
        renderer.scissorTest = true;

        // Clear viewport to transparent black
        renderer.clearColor(0x000000, 0);
        renderer.clear();

        // Render scene with corresponding camera
        renderer.render(scene, cameras[index]);

        renderer.scissorTest = false;
    });

    // Restore default viewport and scissor
    renderer.viewport = new THREE.Vector4(0, 0, width, height);
    renderer.scissor = new THREE.Vector4(0, 0, width, height);
    renderer.scissorTest = false;

    // Restore original render target
    renderer.setRenderTarget(currentRenderTarget);
}

// ===== STARTUP =====
window.addEventListener('load', init);