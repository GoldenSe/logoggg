let scene, camera, renderer, cubeGroup;
let stats = {
    stone: 0,
    iron: 0,
    gold: 0,
    silver: 0,
    coal: 0,
    copper: 0,
    diamond: 0
};
let energy = 100; // Initial energy
const ENERGY_COST = 10; // Energy cost per mining action
const ENERGY_RECOVERY_RATE = 5; // Energy recovery per interval

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('gameArea').appendChild(renderer.domElement);

    cubeGroup = new THREE.Group();
    scene.add(cubeGroup);
    createCubes();

    camera.position.z = 5;

    window.addEventListener('resize', onWindowResize, false);
    renderer.domElement.addEventListener('click', onClick, false);

    document.getElementById('energyCount').textContent = energy;
    setInterval(recoverEnergy, 10000); // Recover energy every 10 seconds
}

function createCubes() {
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0x555555 }), // Stone
        new THREE.MeshBasicMaterial({ color: 0x888888 }), // Iron
        new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Gold
        new THREE.MeshBasicMaterial({ color: 0xc0c0c0 }), // Silver
        new THREE.MeshBasicMaterial({ color: 0x000000 }), // Coal
        new THREE.MeshBasicMaterial({ color: 0xff8c00 }), // Copper
        new THREE.MeshBasicMaterial({ color: 0x00ffff })  // Diamond
    ];

    for (let i = 0; i < 100; i++) {
        const material = materials[getRandomMaterialIndex()];
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        cubeGroup.add(cube);
    }
}

function getRandomMaterialIndex() {
    const random = Math.random();
    if (random < 0.5) return 0; // Stone 50%
    if (random < 0.65) return 1; // Iron 15%
    if (random < 0.75) return 2; // Gold 10%
    if (random < 0.85) return 3; // Silver 10%
    if (random < 0.9) return 4;  // Coal 5%
    if (random < 0.95) return 5; // Copper 5%
    return 6;                    // Diamond 5%
}

function onClick(event) {
    event.preventDefault();
    
    if (energy < ENERGY_COST) {
        alert("Not enough energy!");
        return;
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cubeGroup.children);

    if (intersects.length > 0) {
        const cube = intersects[0].object;
        handleMining(cube);
    }
}

function handleMining(cube) {
    if (energy < ENERGY_COST) {
        alert("Not enough energy!");
        return;
    }
    
    energy -= ENERGY_COST;
    document.getElementById('energyCount').textContent = energy;
    
    const color = cube.material.color.getHex();
    let materialType;

    switch (color) {
        case 0x555555:
            materialType = 'stone';
            break;
        case 0x888888:
            materialType = 'iron';
            break;
        case 0xffff00:
            materialType = 'gold';
            break;
        case 0xc0c0c0:
            materialType = 'silver';
            break;
        case 0x000000:
            materialType = 'coal';
            break;
        case 0xff8c00:
            materialType = 'copper';
            break;
        case 0x00ffff:
            materialType = 'diamond';
            break;
    }

    if (materialType) {
        stats[materialType]++;
        document.getElementById(`${materialType}Count`).textContent = stats[materialType];
        animateExplosion(cube);
    }
}

function animateExplosion(cube) {
    const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const fragments = [];

    for (let i = 0; i < 10; i++) {
        const fragment = new THREE.Mesh(geometry, cube.material);
        fragment.position.copy(cube.position);
        fragment.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
        );
        scene.add(fragment);
        fragments.push(fragment);
    }

    cubeGroup.remove(cube);

    let animationDuration = 500;
    const start = Date.now();

    function animateFragments() {
        const elapsed = Date.now() - start;
        if (elapsed < animationDuration) {
            fragments.forEach(fragment => {
                fragment.position.add(fragment.velocity);
            });
            requestAnimationFrame(animateFragments);
        } else {
            fragments.forEach(fragment => {
                scene.remove(fragment);
            });
            createNewCube();
        }
    }

    animateFragments();
}

function createNewCube() {
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshBasicMaterial({
        color: [0x555555, 0x888888, 0xffff00, 0xc0c0c0, 0x000000, 0xff8c00, 0x00ffff][getRandomMaterialIndex()]
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    cubeGroup.add(cube);
}

function recoverEnergy() {
    energy = Math.min(100, energy + ENERGY_RECOVERY_RATE);
    document.getElementById('energyCount').textContent = energy;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
