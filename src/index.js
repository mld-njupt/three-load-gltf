import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import "./index.css";

//初始化一个three.js场景
function ThreeScene(
  cameraPosition,
  cameraLight,
  sceneLight,
  rendererSize,
  elementId
) {
  this.element = document.createElement("div");
  document.body.appendChild(this.element);
  this.element.id = elementId;
  this.camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  this.camera.position.set(
    cameraPosition.x,
    cameraPosition.y,
    cameraPosition.z
  );
  this.camera.add(cameraLight);
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.setSize(
    window.innerWidth / rendererSize,
    window.innerHeight / rendererSize
  );
  this.renderer.setPixelRatio(window.devicePixelRatio);
  this.element.appendChild(this.renderer.domElement);
  this.scene = new THREE.Scene();
  this.scene.add(sceneLight);
  this.scene.add(this.camera);
  this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  this.clock = new THREE.Clock();
  this.gltfLoader = new GLTFLoader();
  this.url =
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === "development"
      ? "/api/react/Model.gltf"
      : "http://103.118.40.123:9999/react/Model.gltf";
}
ThreeScene.prototype.render = 
 function () {
    //获取时间差
    const elta = this.clock.getDelta();
    this.controls.update(elta);
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }


//组合继承
function inheritPrototype(subClass, superClass) {
  function F() {}
  F.prototype = superClass.prototype;
  subClass.prototype = F.prototype;
  subClass.prototype.constructor = subClass;
}
function MainScene(
  cameraPosition,
  cameraLight,
  sceneLight,
  rendererSize,
  elementId
) {
  ThreeScene.call(
    this,
    cameraPosition,
    cameraLight,
    sceneLight,
    rendererSize,
    elementId
  );
}
inheritPrototype(MainScene, ThreeScene);
MainScene.prototype.loadGLTF = function () {
  const _this = this;
  console.log(this)
  this.gltfLoader.load(this.url, function (gltf) {
    _this.scene.add(gltf.scene);
    _this.render();
  });
};


const mainScene = new ThreeScene(
  { x: 0, y: 0, z: 200 },
  new THREE.PointLight(0xffffff, 1),
  new THREE.AmbientLight(0x222222),
  1,
  "main-wrap"
);
mainScene.loadGLTF();
// //初始化主容器

// //PerspectiveCamera透视投影相机
// const camera = new THREE.PerspectiveCamera(
//   40,
//   window.innerWidth / window.innerHeight,
//   1,
//   1000
// );
// camera.position.set(0, 0, 200);
// const light = new THREE.PointLight(0xffffff, 1);
// camera.add(light);

// //antialias:true 增加抗锯齿效果
// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);

// // const container=document.getElementById("container")
// // container.appendChild(renderer.domElement)
// document.body.appendChild(renderer.domElement);

// const scene = new THREE.Scene();
// scene.add(new THREE.AmbientLight(0x222222));
// scene.add(camera);

// //轨道控制器控制场景的旋转、平移、缩放
// const controls = new OrbitControls(camera, renderer.domElement);
// const clock = new THREE.Clock();

// const gltfLoader = new GLTFLoader();
// const url =
//   // eslint-disable-next-line no-undef
//   process.env.NODE_ENV === "development"
//     ? "/api/react/Model.gltf"
//     : "http://103.118.40.123:9999/react/Model.gltf";
// gltfLoader.load(url, function (gltf) {
//   scene.add(gltf.scene);
//   renderMain();
// });

// //渲染主场景
// function renderMain() {
//   //获取时间差
//   const elta = clock.getDelta();
//   controls.update(elta);
//   requestAnimationFrame(renderMain);
//   renderer.render(scene, camera);
// }

// //坐标轴camera scene 等
// const axisCamera = new THREE.PerspectiveCamera(
//   40,
//   window.innerWidth / window.innerHeight,
//   1,
//   1000
// );
// axisCamera.position.set(30, 50, 100);
// const axisScene = new THREE.Scene();
// const axisRenderer = new THREE.WebGLRenderer({
//   antialias: true,
// });
// axisRenderer.setPixelRatio(window.devicePixelRatio);
// axisRenderer.setSize(window.innerWidth / 5, window.innerHeight / 5);

// //控制坐标轴旋转
// controls.addEventListener("change", function () {
//   const cameraPostion = camera.position; // 大场景相机位置
//   const vector = cameraPostion.clone().sub(controls.target); //
//   const mu =
//     Math.sqrt(
//       Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2)
//     ) / 2; // 求模，除以2是因为z轴上的值不够，相机的位置处于盒子里边
//   const axisCameraPostion = new THREE.Vector3(
//     vector.x / mu,
//     vector.y / mu,
//     vector.z / mu
//   );
//   axisCamera.position.set(
//     axisCameraPostion.x,
//     axisCameraPostion.y,
//     axisCameraPostion.z
//   );
//   axisCamera.lookAt(axisScene.position);
//   axisCamera.updateProjectionMatrix();
// });
