import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import "./index.css";

//init
//PerspectiveCamera透视投影相机
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(0, 0, 200);
const light = new THREE.PointLight(0xffffff, 1);
camera.add(light);

//antialias:true 增加抗锯齿效果
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// const container=document.getElementById("container")
// container.appendChild(renderer.domElement)
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0x222222));
scene.add(camera);

//轨道控制器控制场景的旋转、平移、缩放
const controls = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();
//获取时间差
const elta = clock.getDelta();
controls.update(elta);
const gltfLoader = new GLTFLoader();
const url =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === "development"
    ? "/api/react/Model.gltf"
    : "http://103.118.40.123:9999/react/Model.gltf";
gltfLoader.load(url, function (gltf) {
    scene.add(gltf.scene);
    renderer.render( scene, camera );
});
