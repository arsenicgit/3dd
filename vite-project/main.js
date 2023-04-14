import "./style.css";
import * as t from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new t.Scene();
const spaceTexture = new t.TextureLoader().load("omeganebula1.png");
scene.background = spaceTexture;

const camera = new t.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const topDetector = document.body.getBoundingClientRect().top;
camera.position.set(topDetector * -0.05, topDetector * -0.05, 99.6);

const renderer = new t.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const starContainer = new t.Object3D();
scene.add(starContainer);

const geometry = new t.CylinderGeometry(10, 10, 20, 100, 100, false, 90, 8);
const material = new t.MeshStandardMaterial({
  color: 0xff3456,
});
const meshh = new t.Mesh(geometry, material);

const pointLight = new t.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);

const lightHelper1 = new t.PointLightHelper(pointLight, 3, "red");

const ambientLight = new t.AmbientLight(0xffffff, 1);
const controls = new OrbitControls(camera, renderer.domElement);

scene.add(pointLight, ambientLight, lightHelper1, meshh);
meshh.position.setZ(-100);

function addStar() {
  const geometry = new t.SphereGeometry(1, 10, 10);
  const material = new t.MeshStandardMaterial({
    color:
      "#" +
      t.MathUtils.randInt(0, 9) +
      t.MathUtils.randInt(0, 9) +
      t.MathUtils.randInt(0, 9) +
      t.MathUtils.randInt(0, 9) +
      t.MathUtils.randInt(0, 9) +
      t.MathUtils.randInt(0, 9),
  });
  const star = new t.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => t.MathUtils.randFloatSpread(1000));
  star.position.set(x, y, z);
  starContainer.add(star);
}
Array(2000).fill().forEach(addStar);

const loaderMic = new GLTFLoader();
const micContainer = new t.Object3D();
scene.add(micContainer);
loaderMic.load("./microphone/mic.gltf", function (gltf) {
  micContainer.add(gltf.scene);
});
micContainer.position.set(33, 33, 120);
micContainer.scale.set(2, 2, 2);

const kb = new URL("./keyboard/kb.gltf", import.meta.url);

const assetLoader = new GLTFLoader();
const kbContainer = new t.Object3D();
let mixer;
assetLoader.load(kb.href, function (gltf) {
  const model = gltf.scene;
  kbContainer.add(model);
  scene.add(kbContainer);
  kbContainer.scale.set(5, 5, 5);
  kbContainer.position.set(80, 70, 150);
  mixer = new t.AnimationMixer(model);
  const clips = gltf.animations;
  const action = mixer.clipAction(clips[0]);
  if (action) action.play();
  else {
    console.log("lol");
  }
});

function moveCamera() {
  const tt = document.body.getBoundingClientRect().top;
  micContainer.rotation.x += 0.1;
  micContainer.rotation.z += 0.05;
  kbContainer.rotation.z += 0.01;
  kbContainer.rotation.x += 0.01;
  camera.position.z = 100 + tt * -0.06;
  camera.position.x = tt * -0.06;
  camera.position.y = tt * -0.06;
}
document.body.onscroll = moveCamera;

const raycaster = new t.Raycaster();
const pointer = new t.Vector2();
function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
let isClicked = false;
function clicked() {
  isClicked = true;
  setTimeout(unClicked, 10);
}
function unClicked() {
  isClicked = false;
}
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("click", clicked);

function smoothScroll(target, duration) {
  var target = document.querySelector(target);
  var targetPosition = target.getBoundingClientRect().top;
  var startPosition = window.pageYOffset || window.scrollY;
  var startTime = null;

  function loop(currentTime) {
    if (startTime === null) startTime = currentTime;
    var timeElapsed = currentTime - startTime;
    var run = ease(timeElapsed, startPosition, targetPosition, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(loop);
  }
  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }
  requestAnimationFrame(loop);
}
var section1 = document.querySelector(".section1");
section1.addEventListener("click", function () {
  if (camera.position.z <= 100) {
    smoothScroll(".section2", 1000);
  }
});

const clock = new t.Clock();
function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(clock.getDelta());
  meshh.rotation.x += 0.02;
  starContainer.rotation.x += 0.0006;
  controls.update();
  renderer.render(scene, camera);
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    if (
      (intersects[i].object.name == "Body_low_Microphone_0" &&
        isClicked == true) ||
      (intersects[i].object.name == "Weave_low_Microphone_0" &&
        isClicked == true)
    ) {
      if (window.pageYOffset != 0) {
        window.scrollBy(0, 10);
      }
    }
  }
}

animate();

window.addEventListener("unload", function (e) {
  window.scrollTo(0, 0);
});
