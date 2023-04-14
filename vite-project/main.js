import "./style.css";
import * as t from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new t.Scene();
const spaceTexture = new t.TextureLoader().load("omeganebula1.png");

scene.background = spaceTexture;
const topDetector = document.body.getBoundingClientRect().top;

const starContainer = new t.Object3D();

scene.add(starContainer);

const camera = new t.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(topDetector * -0.05, topDetector * -0.05, 99.6);
const renderer = new t.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new t.CylinderGeometry(10, 10, 20, 100, 100, false, 90, 8);
const material = new t.MeshStandardMaterial({
  color: 0xff3456,
});

const meshh = new t.Mesh(geometry, material);

const pointLight = new t.PointLight(0xffffff);
pointLight.position.set(10, 10, 10);

const ambientLight = new t.AmbientLight(0xffffff, 1);
const controls = new OrbitControls(camera, renderer.domElement);

scene.add(pointLight, ambientLight, meshh);
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

const loader = new GLTFLoader();
const micContainer = new t.Object3D();

scene.add(micContainer);
loader.load("./microphone/mic.gltf", function (gltf) {
  micContainer.add(gltf.scene);
});

micContainer.position.set(33, 33, 120);
micContainer.scale.set(2, 2, 2);

function moveCamera() {
  const tt = document.body.getBoundingClientRect().top;
  micContainer.rotation.x += 0.1;
  micContainer.rotation.z += 0.05;
  camera.position.z = 100 + tt * -0.05;
  camera.position.x = tt * -0.05;
  camera.position.y = tt * -0.05;
}

document.body.onscroll = moveCamera;

const raycaster = new t.Raycaster();
const pointer = new t.Vector2();

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

let x = false;
function clickedd() {
  x = true;
  setTimeout(unClicked, 10);
}
function unClicked() {
  x = false;
}
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
  smoothScroll(".section2", 1000);
});

function animate() {
  requestAnimationFrame(animate);
  meshh.rotation.x += 0.02;
  starContainer.rotation.x += 0.0006;
  controls.update();
  renderer.render(scene, camera);
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    if (
      (intersects[i].object.name == "Body_low_Microphone_0" && x == true) ||
      (intersects[i].object.name == "Weave_low_Microphone_0" && x == true)
    ) {
      if (window.pageYOffset != 0) {
        window.scrollBy(0, 10);
      }
    }
  }
  console.log(topDetector);
}

window.addEventListener("pointermove", onPointerMove);
window.addEventListener("click", clickedd);
animate();

window.addEventListener("unload", function (e) {
  window.scrollTo(0, 0);
});
