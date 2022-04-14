import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import inheritPrototype from "./inheritPrototype";
import {
  CreateControl,
  CreateController,
} from "./control";
import "./index.css";
import "./control.css";

let _switchState ={
  0: true,
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  8: true,
  9: true,
  10: true,
  11: true,
  12: true,
  13: true,
  14: true,
  15: true,
  16: true,
  17: true,
  18: true,
  19: true,
  20: true,
  21: true,
  22: true,
  23: true,
  24: true,
  25: true,
  26: true,
  27: true,
  all: false,
};
let switchState=new Proxy(_switchState,{
  set(obj, key, value) {
    obj[key] = value;
    return true

  }
})
const handleSwitch = (no) => {
  return (...args) => {
   switchState[no]=args[0].target.checked
  };
};
const controlWrap = new CreateControl("control-wrap", document.body, true);
controlWrap.init();

Object.entries(switchState).map((value) => {
  // eslint-disable-next-line no-unused-vars
  const controller = new CreateController(
    controlWrap.element,
    value[0],
    value[1],
    handleSwitch(value[0])
  );
});

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
}
ThreeScene.prototype.render = function () {
  //获取时间差
  const elta = this.clock.getDelta();
  this.controls.update(elta);
  requestAnimationFrame(this.render.bind(this));
  this.renderer.render(this.scene, this.camera);
};

//组合继承
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
  this.gltfLoader = new GLTFLoader();
}
inheritPrototype(MainScene, ThreeScene);
MainScene.prototype.loadGLTF = function () {
  const url =
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === "development"
      ? "/api/react/Model.gltf"
      : "http://103.118.40.123:9999/react/Model.gltf";
  const _this = this;
  this.gltfLoader.load(url, function (gltf) {
    _this.scene.add(gltf.scene);
    _this.render();
  });
};

function AxisScene(
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
  this.fontLoader = new FontLoader();
}
inheritPrototype(AxisScene, ThreeScene);
AxisScene.prototype.loadAXIS = function () {
  const dir1 = new THREE.Vector3(1, 0, 0); //创建箭头向量
  const dir2 = new THREE.Vector3(0, 1, 0);
  const dir3 = new THREE.Vector3(0, 0, 1);
  const origin = new THREE.Vector3(0, 0, 0);
  const hex1 = 0xffff00;
  const hex2 = 0xeb4334;
  const hex3 = 0x35aa53;
  //箭头指示
  this.arrowHelper1 = new THREE.ArrowHelper(dir1, origin, 20, hex1, 5, 2);
  this.arrowHelper2 = new THREE.ArrowHelper(dir2, origin, 20, hex2, 5, 2);
  this.arrowHelper3 = new THREE.ArrowHelper(dir3, origin, 20, hex3, 5, 2);
  this.scene.add(this.arrowHelper1); //面向右边
  this.scene.add(this.arrowHelper2); //面向头
  this.scene.add(this.arrowHelper3); //面向眼睛
};
AxisScene.prototype.loadFONT = function () {
  const url =
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === "development"
      ? "/api/react/helvetiker_bold.typeface.json"
      : "http://103.118.40.123:9999/react/helvetiker_bold.typeface.json";
  const _this = this;
  this.fontLoader.load(url, function (font) {
    const geometry = new TextGeometry("N", {
      //“N是要加载的字”
      font: font,
      size: 5,
      height: 2,
      curveSegments: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelOffset: 0,
      bevelSegments: 1,
    });
    const fontMaterial = new THREE.MeshLambertMaterial({
      color: 0xeb4334,
    });

    _this.fontModel = new THREE.Mesh(geometry, fontMaterial);
    _this.fontModel.position.x = -2; //调整一下N的位置

    _this.scene.add(_this.fontModel);
  });
};
// //重写父构造函数render函数
AxisScene.prototype.render = function (mainControls) {
  requestAnimationFrame(this.render.bind(this, mainControls));
  //让场景二的三个箭头随着场景一的相机旋转情况旋转
  if (this.fontModel) {
    this.arrowHelper1.rotation.y = -mainControls.getAzimuthalAngle();
    this.arrowHelper1.rotation.x = -mainControls.getPolarAngle();
    this.arrowHelper2.rotation.x = -mainControls.getPolarAngle();
    this.arrowHelper3.rotation.z = mainControls.getAzimuthalAngle();
    this.arrowHelper3.rotation.x = 1.57079637 - mainControls.getPolarAngle();
    /* fontModel是N，让它随着arrowHelper3转动而转动
     */
    this.fontModel.rotation.x = -(mainControls.getPolarAngle() - 1.57079637);
    this.fontModel.position.z = -23 * Math.sin(mainControls.getPolarAngle());
    this.fontModel.position.y = 23 * Math.cos(mainControls.getPolarAngle());
    this.renderer.render(this.scene, this.camera);
  }
};
const mainScene = new MainScene(
  { x: 0, y: 0, z: 200 },
  new THREE.PointLight(0xffffff, 1),
  new THREE.AmbientLight(0x222222),
  1,
  "main-wrap"
);
mainScene.loadGLTF();
const axisScene = new AxisScene(
  { x: 30, y: 50, z: 100 },
  new THREE.PointLight(0xffffff, 1),
  new THREE.AmbientLight(0x222222),
  5,
  "axis-wrap"
);
axisScene.loadFONT();
axisScene.loadAXIS();
axisScene.render(mainScene.controls);
