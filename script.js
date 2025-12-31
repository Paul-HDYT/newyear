// =======================
// SCENE
// =======================
const scene = new THREE.Scene();

// =======================
// CAMERA
// =======================
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 8);

// =======================
// RENDERER
// =======================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// =======================
// TEXTURE LOADER
// =======================
const textureLoader = new THREE.TextureLoader();

// =======================
// GALAXY BACKGROUND
// =======================
const galaxyTexture = textureLoader.load('./textures/galaxy.jpg');
const galaxyGeometry = new THREE.SphereGeometry(100, 64, 64);
const galaxyMaterial = new THREE.MeshBasicMaterial({
  map: galaxyTexture,
  color: 0x4444aa, // tint biru lembut agar terlihat
  side: THREE.BackSide,
  depthWrite: false,
  transparent: true,
  opacity: 0.8
});
const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
scene.add(galaxy);

// =======================
// GALAXY PARTICLES / NEBULA
// =======================
const galaxyParticlesGeometry = new THREE.BufferGeometry();
const galaxyParticleCount = 3000;
const galaxyPositions = [];

for (let i = 0; i < galaxyParticleCount; i++) {
  galaxyPositions.push(
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200
  );
}

galaxyParticlesGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(galaxyPositions, 3)
);

const galaxyParticlesMaterial = new THREE.PointsMaterial({
  color: 0x8866ff,
  size: 0.5,
  transparent: true,
  opacity: 0.6
});

const galaxyParticles = new THREE.Points(galaxyParticlesGeometry, galaxyParticlesMaterial);
scene.add(galaxyParticles);

// =======================
// STARS
// =======================
const starGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const starPositions = [];

for (let i = 0; i < starCount; i++) {
  starPositions.push(
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200
  );
}

starGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(starPositions, 3)
);

const stars = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.6 })
);
scene.add(stars);

// =======================
// EARTH
// =======================
const earthTexture = textureLoader.load('./textures/earth_daymap.jpg');
const earthNormal = textureLoader.load('./textures/earth_normal.jpg');
const earthSpecular = textureLoader.load('./textures/earth_specular.jpg');

const earthGeometry = new THREE.SphereGeometry(1.7, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({
  map: earthTexture,
  normalMap: earthNormal,
  specularMap: earthSpecular,
  specular: new THREE.Color(0x333333),
  shininess: 20
});

const planet = new THREE.Mesh(earthGeometry, earthMaterial);
planet.rotation.z = 0.41; // kemiringan bumi
scene.add(planet);

// =======================
// MOON
// =======================
const moonTexture = textureLoader.load('./textures/moon.jpg');
const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  emissive: new THREE.Color(0x444444),
  emissiveIntensity: 0.5
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
const moonDistance = 3;
moon.position.set(moonDistance, 0, 0);
scene.add(moon);

let moonAngle = 0;

// =======================
// LIGHTING
// =======================
const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(5, 3, 5);
scene.add(sunLight);

// =======================
// CAMERA ORBIT
// =======================
let angle = 0;

// DOA ISLAMI BERGANTI
// =======================
const hopeTextElement = document.getElementById("hopeText");

const hopes = [
  "Tahun baru, Doa baru, amal baru ✨",
  "Semoga lebih baik dari tahun kemarin🌙",
  "Semoga Solatnya selalu tepat waktu🤲",
  "Semoga selalu diberikan kebijaksanaan dan kedamaian dalam hidup🌸",
  "Al Fatihah🕊️"
];

let hopeIndex = 0;

function typeHope(text, callback) {
  let index = 0;
  hopeTextElement.textContent = "";
  hopeTextElement.style.display = "block"; // pastikan terlihat
  hopeTextElement.style.borderRight = "2px solid #ffcc00"; // border ketik

  function typing() {
    if (index < text.length) {
      hopeTextElement.textContent += text.charAt(index);
      index++;
      setTimeout(typing, 80); // kecepatan mengetik
    } else {
      hopeTextElement.style.borderRight = "none"; // hilangkan border
      // Tunggu 3 detik lalu hilangkan teks
      setTimeout(() => {
        hopeTextElement.style.display = "none";
        if (callback) callback(); // panggil callback untuk teks berikutnya
      }, 3000);
    }
  }

  typing();
}

function changeHope() {
  if (hopeIndex < hopes.length) {
    typeHope(hopes[hopeIndex], () => {
      hopeIndex++;
      changeHope(); // lanjut ke teks berikutnya
    });
  }
}

// Mulai menampilkan teks
changeHope();

// =======================
// METEOR DENGAN TRAIL
// =======================
function createMeteor() {
  const meteorGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const meteorMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);

  meteor.position.set(
    (Math.random() - 0.5) * 50,
    20,
    (Math.random() - 0.5) * 50
  );

  scene.add(meteor);

  // Trail line
  const trailGeometry = new THREE.BufferGeometry();
  const trailPositions = new Float32Array(100 * 3);
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

  const trailMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
  const trail = new THREE.Line(trailGeometry, trailMaterial);
  scene.add(trail);

  const speed = 0.3 + Math.random() * 0.3;

  function moveMeteor() {
    meteor.position.x -= speed;
    meteor.position.y -= speed;
    meteor.position.z -= speed / 2;

    // Update trail positions
    const positions = trail.geometry.attributes.position.array;
    for (let i = positions.length - 3; i >= 3; i--) {
      positions[i] = positions[i - 3];
      positions[i + 1] = positions[i - 2];
      positions[i + 2] = positions[i - 1];
    }
    positions[0] = meteor.position.x;
    positions[1] = meteor.position.y;
    positions[2] = meteor.position.z;
    trail.geometry.attributes.position.needsUpdate = true;

    if (meteor.position.y < -5 || meteor.position.x < -25) {
      scene.remove(meteor);
      scene.remove(trail);
      meteorGeometry.dispose();
      meteorMaterial.dispose();
      trailGeometry.dispose();
      trailMaterial.dispose();
    } else {
      requestAnimationFrame(moveMeteor);
    }
  }

  moveMeteor();
}

setInterval(createMeteor, 1500);

// =======================
// FIREWORKS
// =======================
function createFirework() {
  const geometry = new THREE.BufferGeometry();
  const count = 200;
  const positions = [];
  const colors = [];

  const base = {
    x: (Math.random() - 0.5) * 15,
    y: (Math.random() - 0.5) * 8,
    z: (Math.random() - 0.5) * 15
  };

  for (let i = 0; i < count; i++) {
    positions.push(base.x, base.y, base.z);
    colors.push(Math.random(), Math.random(), Math.random());
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true
  });

  const firework = new THREE.Points(geometry, material);
  scene.add(firework);

  let progress = 0;

  function explode() {
    progress += 0.03;
    const pos = geometry.attributes.position.array;

    for (let i = 0; i < pos.length; i += 3) {
      pos[i] += (Math.random() - 0.5) * progress;
      pos[i + 1] += (Math.random() - 0.5) * progress;
      pos[i + 2] += (Math.random() - 0.5) * progress;
    }

    geometry.attributes.position.needsUpdate = true;

    if (progress < 1) {
      requestAnimationFrame(explode);
    } else {
      scene.remove(firework);
      geometry.dispose();
      material.dispose();
    }
  }

  explode();
}

setInterval(createFirework, 2500);

// =======================
// ANIMATION LOOP
// =======================
function animate() {
  requestAnimationFrame(animate);

  // Stars rotation
  stars.rotation.y += 0.0003;

  // Earth rotation
  planet.rotation.y += 0.001;

  // Moon orbit
  moonAngle += 0.01;
  moon.position.x = planet.position.x + Math.cos(moonAngle) * moonDistance;
  moon.position.z = planet.position.z + Math.sin(moonAngle) * moonDistance;
  moon.rotation.y += 0.005;

  // Camera orbit
  angle += 0.0008;
  camera.position.x = Math.sin(angle) * 8;
  camera.position.z = Math.cos(angle) * 8;
  camera.lookAt(planet.position);

  renderer.render(scene, camera);
}
animate();

// =======================
// RESPONSIVE
// =======================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// =======================
// MUSIC CONTROL
// =======================
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("playMusic");
let isPlaying = false;

musicBtn.onclick = () => {
  if (!isPlaying) {
    music.play();
    musicBtn.textContent = "⏸";
  } else {
    music.pause();
    musicBtn.textContent = "🎵";
  }
  isPlaying = !isPlaying;
};
