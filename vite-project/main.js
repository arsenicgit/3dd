import "./style.css";
import * as t from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new t.Scene();
const spaceTexture = new t.TextureLoader().load("spacee.png");
spaceTexture.minFilter = t.LinearFilter;
scene.background = spaceTexture;

function setBackground(scene, backgroundImageWidth, backgroundImageHeight) {
  var windowSize = function (withScrollBar) {
    var wid = 0;
    var hei = 0;
    if (typeof window.innerWidth != "undefined") {
      wid = window.innerWidth;
      hei = window.innerHeight;
    } else {
      if (document.documentElement.clientWidth == 0) {
        wid = document.body.clientWidth;
        hei = document.body.clientHeight;
      } else {
        wid = document.documentElement.clientWidth;
        hei = document.documentElement.clientHeight;
      }
    }
    return {
      width: wid - (withScrollBar ? wid - document.body.offsetWidth + 1 : 0),
      height: hei,
    };
  };

  if (scene.background) {
    var size = windowSize(true);
    var factor =
      backgroundImageWidth / backgroundImageHeight / (size.width / size.height);

    scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
    scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;

    scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
    scene.background.repeat.y = factor > 1 ? 1 : factor;
  }
}

setBackground(scene, 7680, 4320);

const camera = new t.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1300
);
const topDetector = document.body.getBoundingClientRect().top;
camera.position.set(topDetector * -0.05, topDetector * -0.05, 99.6);

const renderer = new t.WebGL1Renderer({
  antialias: true,
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const starContainer = new t.Object3D();
scene.add(starContainer);

const pointLight = new t.PointLight(0xffffff, 0);
const pointLight1 = new t.PointLight(0xffffff, 4);
const pointLight2 = new t.PointLight(0xffffff, 4);
pointLight.position.set(9, 9, 9);
pointLight1.position.set(-30, 40, 120);
pointLight2.position.set(130, 140, 230);

const lightHelper = new t.PointLightHelper(pointLight, 3, "red");
const lightHelper1 = new t.PointLightHelper(pointLight2, 3, "red");

const ambientLight = new t.AmbientLight(0xffffff, 2);
const controls = new OrbitControls(camera, renderer.domElement);

scene.add(pointLight, ambientLight, pointLight1); //lightHelper);

function colorGen() {
  let hue = Math.floor(Math.random() * 360);
  while (hue > 50 && hue < 350) {
    hue = Math.floor(Math.random() * 360);
  }
  return {
    h: hue,
    s: 100,
    l: 50,
  };
}

function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}

function addStar() {
  const geometry = new t.SphereGeometry(1, 10, 10);
  const material = new t.MeshStandardMaterial({
    color: HSLToHex(colorGen().h, colorGen().s, colorGen().l),
  });
  const star = new t.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => t.MathUtils.randFloatSpread(1000));
  star.position.set(x, y, z);
  starContainer.add(star);
}
Array(1000).fill().forEach(addStar);

const loaderHg = new GLTFLoader();
const hgContainer = new t.Object3D();
scene.add(hgContainer);
loaderHg.load("./hourglass/hg.gltf", function (gltf) {
  hgContainer.add(gltf.scene);
});
hgContainer.position.set(0, 0, -100);
hgContainer.scale.set(2, 2, 2);

const loaderMic = new GLTFLoader();
const micContainer = new t.Object3D();
scene.add(micContainer);
loaderMic.load("./microphone/mic.gltf", function (gltf) {
  micContainer.add(gltf.scene);
});
micContainer.position.set(33, 33, 120);
micContainer.scale.set(2, 2, 2);

const loaderCont = new GLTFLoader();
const contContainer = new t.Object3D();
scene.add(contContainer);
loaderCont.load("./controller/cont.gltf", function (gltf) {
  contContainer.add(gltf.scene);
});
contContainer.position.set(130, 135, 250);
contContainer.scale.set(1.4, 1.4, 1.4);

const loaderGl = new GLTFLoader();
const glContainer = new t.Object3D();
scene.add(glContainer);
loaderGl.load("./globe/globeStand.gltf", function (gltf) {
  glContainer.add(gltf.scene);
});
glContainer.position.set(208, 180, 250);
glContainer.rotation.set(0, 200, 0);
glContainer.scale.set(1.5, 1.5, 1.5);

const loaderGl1 = new GLTFLoader();
const glContainer1 = new t.Object3D();
scene.add(glContainer1);
loaderGl1.load("./globeSphere/globeSphere.gltf", function (gltf) {
  glContainer1.add(gltf.scene);
});
glContainer1.position.set(207, 180, 252);
glContainer1.scale.set(1.5, 1.5, 1.5);

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
});

function moveCamera() {
  const tt = document.body.getBoundingClientRect().top;
  micContainer.rotation.x += 0.1;
  micContainer.rotation.z += 0.05;
  kbContainer.rotation.z += 0.03;
  kbContainer.rotation.x += 0.01;
  contContainer.rotation.y += 0.05;
  contContainer.rotation.x += 0.06;
  camera.position.z = 100 + tt * -0.06;
  camera.position.x = tt * -0.06;
  camera.position.y = tt * -0.06;
}
document.body.onscroll = moveCamera;

const micRaycaster = new t.Raycaster();
const kbRaycaster = new t.Raycaster();
const contRaycaster = new t.Raycaster();
const glRaycaster = new t.Raycaster();
const pointer = new t.Vector2();
function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
let isClicked = false;
function clicked() {
  isClicked = true;
  setTimeout(unClicked, 100);
}
function unClicked() {
  isClicked = false;
  micContainer.scale.set(2, 2, 2);
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
if (camera.position.z <= 100) {
  section1.addEventListener("click", function () {
    smoothScroll(".section2", 1000);
  });
}

const clock = new t.Clock();
function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(clock.getDelta());
  starContainer.rotation.x += 0.0006;
  hgContainer.rotation.x += 0.02;
  glContainer1.rotation.y += 0.03;
  controls.update();
  renderer.render(scene, camera);
  micRaycaster.setFromCamera(pointer, camera);
  const intersects = micRaycaster.intersectObjects(scene.children);
  contRaycaster.setFromCamera(pointer, camera);
  const contintersects = contRaycaster.intersectObjects(scene.children);
  glRaycaster.setFromCamera(pointer, camera);
  const glintersects = glRaycaster.intersectObjects(scene.children);
  const res = window.screen.width / window.screen.height;
  for (let i = 0; i < intersects.length; i++) {
    if (
      (intersects[i].object.name == "Body_low_Microphone_0" &&
        isClicked == true) ||
      (intersects[i].object.name == "Weave_low_Microphone_0" &&
        isClicked == true)
    ) {
      if (window.pageYOffset != 0) {
        document.getElementById("microphone").style.textShadow =
          "0 0 0px #ffc7a1, 0 0 10px #15002e, 0 0 20px #15002e, 0 0 40px #15002e";
        if (res > 1.7778) {
          document.getElementById("microphone").style.top =
            document.documentElement.scrollTop * (res * 0.075) + "vh";
        } else if (res < 1.7778 && res > 1.5) {
          document.getElementById("microphone").style.top =
            document.documentElement.scrollTop * (res * 0.057) + "vh";
        } else if (res < 1.5 && res > 0.9) {
          document.getElementById("microphone").style.top =
            document.documentElement.scrollTop * (res * 0.13) + "vh";
        } else if (res < 0.9 && res > 0.5) {
          document.getElementById("microphone").style.top =
            document.documentElement.scrollTop * (res * 0.21) + "vh";
        } else {
          document.getElementById("microphone").style.top =
            document.documentElement.scrollTop * (res * 0.3) + "vh";
        }
      }
    }
  }
  for (let i = 0; i < glintersects.length; i++) {
    if (
      (glintersects[i].object.name == "Cylinder_1" && isClicked == true) ||
      (glintersects[i].object.name == "Icosphere" && isClicked == true) ||
      (glintersects[i].object.name == "Torus001" && isClicked == true) ||
      (glintersects[i].object.name == "Torus" && isClicked == true) ||
      (glintersects[i].object.name == "Cylinder_2" && isClicked == true)
    ) {
      if (window.pageYOffset != 0) {
        document.getElementById("globe").style.textShadow =
          "0 0 0px #ffc7a1, 0 0 10px #15002e, 0 0 20px #15002e, 0 0 40px #15002e";
        if (res > 1.7778) {
          document.getElementById("globe").style.top =
            document.documentElement.scrollTop * (res * 0.075) + "vh";
        } else if (res < 1.7778 && res > 1.5) {
          document.getElementById("globe").style.top =
            document.documentElement.scrollTop * (res * 0.057) + "vh";
        } else if (res < 1.5 && res > 0.9) {
          document.getElementById("globe").style.top =
            document.documentElement.scrollTop * (res * 0.13) + "vh";
        } else if (res < 0.9 && res > 0.5) {
          document.getElementById("globe").style.top =
            document.documentElement.scrollTop * (res * 0.21) + "vh";
        } else {
          document.getElementById("globe").style.top =
            document.documentElement.scrollTop * (res * 0.3) + "vh";
        }
      }
    }
  }
  for (let i = 0; i < contintersects.length; i++) {
    if (
      (contintersects[i].object.name == "Plane002_11_-_Default_0" &&
        isClicked == true) ||
      (contintersects[i].object.name == "Plane002_10_-_Default_0" &&
        isClicked == true) ||
      (contintersects[i].object.name == "Cylinder005_10_-_Default_0" &&
        isClicked == true) ||
      (contintersects[i].object.name == "Cylinder004_10_-_Default_0" &&
        isClicked == true) ||
      (contintersects[i].object.name == "Cylinder007_rubber_0" &&
        isClicked == true) ||
      (contintersects[i].object.name == "Cylinder008_rubber_0" &&
        isClicked == true) ||
      (contintersects[i].object.name == "Plane002_ultrablack_0" &&
        isClicked == true) ||
      (contintersects[i].object.name == "topbuttons001_ultrablack_0" &&
        isClicked == true) ||
      (contintersects[i].object.name == "bottombuttons001_ultrablack_0" &&
        isClicked == true) ||
      (contintersects[i].object.name == "bottombuttons_ultrablack_0" &&
        isClicked == true) ||
      (contintersects[i].object.name == "touchpad_11_-_Default_0" &&
        isClicked == true)

      //console.log(contintersects[i].object.name)
    ) {
      if (window.pageYOffset != 0) {
        document.getElementById("controller").style.textShadow =
          "0 0 0px #ffc7a1, 0 0 10px #15002e, 0 0 20px #15002e, 0 0 40px #15002e";
        if (res > 1.7778) {
          document.getElementById("controller").style.top =
            document.documentElement.scrollTop * (res * 0.075) + "vh";
          console.log(res);
        } else if (res < 1.7778 && res > 1.5) {
          document.getElementById("controller").style.top =
            document.documentElement.scrollTop * (res * 0.057) + "vh";
        } else if (res < 1.5 && res > 0.9) {
          document.getElementById("controller").style.top =
            document.documentElement.scrollTop * (res * 0.13) + "vh";
        } else if (res < 0.9 && res > 0.5) {
          document.getElementById("controller").style.top =
            document.documentElement.scrollTop * (res * 0.21) + "vh";
        } else {
          document.getElementById("controller").style.top =
            document.documentElement.scrollTop * (res * 0.3) + "vh";
        }
      }
    }
  }

  kbRaycaster.setFromCamera(pointer, camera);
  const kbIntersects = kbRaycaster.intersectObjects(scene.children);
  let objArray = [
    "Object_0",
    "Object_2",
    "Object_4",
    "Object_6",
    "Object_8",
    "Object_10",
    "Object_12",
    "Object_14",
    "Object_16",
    "Object_18",
    "Object_20",
    "Object_22",
    "Object_24",
    "Object_26",
    "Object_28",
    "Object_30",
    "Object_32",
    "Object_34",
    "Object_36",
    "Object_38",
    "Object_40",
    "Object_42",
    "Object_44",
    "Object_46",
    "Object_48",
    "Object_50",
    "Object_52",
    "Object_54",
    "Object_56",
    "Object_58",
    "Object_60",
    "Object_62",
    "Object_64",
    "Object_66",
    "Object_104",
    "Object_106",
    "Object_108",
    "Object_110",
    "Object_112",
    "Object_114",
    "Object_116",
    "Object_118",
    "Object_120",
    "Object_122",
    "Object_124",
    "Object_126",
    "Object_128",
    "Object_130",
    "Object_132",
    "Object_134",
    "Object_136",
    "Object_138",
    "Object_140",
    "Object_142",
    "Object_144",
    "Object_146",
    "Object_148",
    "Object_150",
    "Object_152",
    "Object_154",
    "Object_156",
    "Object_158",
    "Object_160",
    "Object_162",
    "Object_164",
    "Object_166",
    "Object_168",
    "Object_170",
    "Object_172",
    "Object_174",
    "Object_176",
    "Object_178",
    "Object_180",
    "Object_182",
    "Object_184",
    "Object_186",
    "Object_80",
    "Object_40_1",
  ];
  for (let i = 0; i < kbIntersects.length; i++) {
    for (let j = 0; j < objArray.length; j++)
      if (kbIntersects[i].object.name == objArray[j] && isClicked == true) {
        if (window.pageYOffset != 0) {
          document.getElementById("keyboard").style.textShadow =
            "0 0 0px #ffc7a1, 0 0 10px #15002e, 0 0 20px #15002e, 0 0 40px #15002e, 0 0 80px #15002e";
          if (res > 1.7778) {
            document.getElementById("keyboard").style.top =
              document.documentElement.scrollTop * (res * 0.075) + "vh";
          } else if (res < 1.7778 && res > 1.5) {
            document.getElementById("keyboard").style.top =
              document.documentElement.scrollTop * (res * 0.057) + "vh";
          } else if (res < 1.5 && res > 0.9) {
            document.getElementById("keyboard").style.top =
              document.documentElement.scrollTop * (res * 0.13) + "vh";
          } else if (res < 0.9 && res > 0.5) {
            document.getElementById("keyboard").style.top =
              document.documentElement.scrollTop * (res * 0.21) + "vh";
          } else {
            document.getElementById("keyboard").style.top =
              document.documentElement.scrollTop * (res * 0.3) + "vh";
          }
        }
      }
  }
}
animate();

window.addEventListener("unload", function (e) {
  window.scrollTo(0, 0);
});
