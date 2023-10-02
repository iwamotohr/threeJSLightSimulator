import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader.js";
import * as dat from "lil-gui";
/**
 * UIデバックを実装
 */
const gui = new dat.GUI();
console.log(gui);

/**
 * キャンバスを取得
 */
const canvas = document.querySelector(".webgl");

/**
 * 必須の3要素を追加
 */
// シーン
const scene = new THREE.Scene();

// サイズ設定
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// カメラ
const camera = new THREE.PerspectiveCamera(
  40,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.y = 5;
camera.position.z = 6;
scene.add(camera);

// レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

/**
 * カメラ制御
 */
new OrbitControls(camera, renderer.domElement);

/**
 * オブジェクトの作成
 */

// 床・壁・天井
// ジオメトリ
const planeGeometry = new THREE.PlaneGeometry(5, 5, 1);
const wallPlaneGeometry = new THREE.PlaneGeometry(5, 2.7, 1);

// マテリアル
const floorMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  shininess: 250,
  // specular: new THREE.Color("#FFD6A1"),
});

const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  // side: THREE.DoubleSide,
});

// メッシュ化
const floor = new THREE.Mesh(planeGeometry, floorMaterial);
const cell = new THREE.Mesh(planeGeometry, wallMaterial);
const wallLeft = new THREE.Mesh(wallPlaneGeometry, wallMaterial);
const wallBack = new THREE.Mesh(wallPlaneGeometry, wallMaterial);
const wallRight = new THREE.Mesh(wallPlaneGeometry, wallMaterial);

floor.rotation.x = -Math.PI * 0.5;
floor.receiveShadow = true;

cell.rotation.x = Math.PI * 0.5;
cell.position.set(0, 2.7);
cell.receiveShadow = true;

wallLeft.position.set(-2.5, 1.35, 0);
wallLeft.rotation.y = Math.PI * 0.5;
wallLeft.receiveShadow = true;

wallBack.position.set(0, 1.35, -2.5);
wallBack.receiveShadow = true;

wallRight.position.set(2.5, 1.35, 0);
wallRight.rotation.y = -Math.PI * 0.5;
wallRight.receiveShadow = true;

scene.add(floor, cell, wallLeft, wallBack, wallRight);

// ペンダントライト
// ジオメトリ
// 本体
const cornGeometry = new THREE.ConeGeometry(0.2, 0.25, 30, 1, true);
// コード
const cylinderGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.6, 30);

// マテリアル
const pendantLightMaterial = new THREE.MeshLambertMaterial({
  color: 0xf2f2f2,
  side: THREE.DoubleSide,
});
// メッシュ
// 本体
const pendantLight1 = new THREE.Mesh(cornGeometry, pendantLightMaterial);
pendantLight1.position.set(0.3, 1.975, 0);
pendantLight1.castShadow = true;
// コード
const pendantLightCode1 = new THREE.Mesh(
  cylinderGeometry,
  pendantLightMaterial
);
pendantLightCode1.position.set(0.3, 2.4, 0);
scene.add(pendantLight1, pendantLightCode1);

// フロアライト
// ジオメトリ―
const floorLightCylinderGeometry = new THREE.CylinderGeometry(
  0.12,
  0.15,
  0.15,
  50,
  50,
  true
);
const floorLightStickCylinderGeometry = new THREE.CylinderGeometry(
  0.004,
  0.004,
  1,
  32,
  32
);
const floorLightFootCylinderGeometry = new THREE.CylinderGeometry(
  0.1,
  0.1,
  0.004,
  32,
  32
);

// マテリアル
const floorLightMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});

const floorLightStickMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
});
const floorLightFootMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
});

// 本体 メッシュ化
const floorLight = new THREE.Mesh(
  floorLightCylinderGeometry,
  floorLightMaterial
);
floorLight.position.set(-0.6, 1.05, -1.2);
floorLight.castShadow = true;

const floorLightStick = new THREE.Mesh(
  floorLightStickCylinderGeometry,
  floorLightStickMaterial
);
floorLightStick.position.set(-0.6, 0.5, -1.2);
floorLightStick.castShadow = true;

const floorLightFoot = new THREE.Mesh(
  floorLightFootCylinderGeometry,
  floorLightFootMaterial
);
floorLightFoot.position.set(-0.6, 0.002, -1.2);
floorLightFoot.castShadow = true;

scene.add(floorLight, floorLightStick, floorLightFoot);

// //ソファー
// // 3DS形式のモデルデータを読み込む
// const loader = new TDSLoader();
// // 3dsファイルのパスを指定
// const sofaObj = await loader.loadAsync("models/Koltuk.3ds");
// sofaObj.rotation.set(-Math.PI * 0.5, 0, Math.PI * 0.5);
// sofaObj.position.set(-1, 0.15, 0);
// sofaObj.castShadow = true;
// // 読み込み後に3D空間に追加
// scene.add(sofaObj);

// ローテーブル
// テーブルボード・脚
const tableCylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.02, 40);
const footCylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.29, 40);
const tableMaterial = new THREE.MeshPhysicalMaterial({
  roughness: 0.05,
  transmission: 0.8,
  side: THREE.DoubleSide,
});
tableMaterial.thickness = 5; // 屈折させるため厚みを持たせる

const footMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});

const tableBoard = new THREE.Mesh(tableCylinderGeometry, tableMaterial);
tableBoard.position.set(0.3, 0.3, 0);

const tableFoot = new THREE.Mesh(footCylinderGeometry, footMaterial);
tableFoot.position.set(0.3, 0.14, 0);
tableFoot.castShadow = true;

scene.add(tableBoard, tableFoot);

//　テレビ
// ジオメトリ
const boxGeometry = new THREE.BoxGeometry(1.2, 0.6, 0.02);
// マテリアル
const TVMaterial = new THREE.MeshPhongMaterial({
  color: 0x000000,
  shininess: 250,
  // specular: new THREE.Color("#FFD6A1"),
});
// メッシュ化
const TV = new THREE.Mesh(boxGeometry, TVMaterial);
TV.rotation.set(0, Math.PI * 0.5, 0);
TV.position.set(2.49, 0.8, 0);
scene.add(TV);

/**
 * 照明の追加
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xfff9f0, 2);
pointLight.position.set(0.3, 1.75, 0);
pointLight.shadowMapWidth = 2048;
pointLight.shadowMapHeight = 2048;
pointLight.castShadow = true;
scene.add(pointLight);

const spotLight = new THREE.SpotLight(0xffd6a1, 2, 6, Math.PI * 0.45, 0.4, 1);
spotLight.position.set(-0.6, 1.05, -1.2);
spotLight.target.position.x = -0.6;
spotLight.target.position.z = -1.2;
spotLight.shadowMapWidth = 2048;
spotLight.shadowMapHeight = 2048;
spotLight.castShadow = true;
scene.add(spotLight, spotLight.target);

const rectAreaLight = new THREE.RectAreaLight(0xcaddff, 1, 1.3, 0.7);
rectAreaLight.position.set(2.3, 0.8, 0);
rectAreaLight.lookAt(2.5, 0.8, 0);
scene.add(rectAreaLight);

// ヘルパー光源
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
scene.add(pointLightHelper);

// UIデバック
const pointLightFolder = gui.addFolder("point light");
pointLightFolder.add(pointLight, "visible");
pointLightFolder.add(pointLight, "intensity").min(0).max(4).step(0.01);
pointLightFolder.add(pointLight.position, "y").min(0).max(3).step(0.01);
pointLightFolder.addColor(pointLight, "color");
pointLightFolder.add(pointLightHelper, "visible").name("point light helper");

const spotLightFolder = gui.addFolder("spot light");
spotLightFolder.add(spotLight, "visible");
spotLightFolder.add(spotLight, "intensity").min(0).max(4).step(0.01);
spotLightFolder.add(spotLight, "penumbra").min(0).max(2).step(0.01);
spotLightFolder
  .add(spotLight, "angle")
  .min(0)
  .max(Math.PI * 0.5)
  .step(0.1);
spotLightFolder.addColor(spotLight, "color");

const rectAreaLightFolder = gui.addFolder("rect area light");
rectAreaLightFolder.add(rectAreaLight, "visible");
rectAreaLightFolder.add(rectAreaLight, "intensity").min(0).max(4).step(0.01);
rectAreaLightFolder
  .add(rectAreaLight.position, "x")
  .min(2.3)
  .max(2.499)
  .step(0.001);
rectAreaLightFolder.addColor(rectAreaLight, "color");

gui.close();

// ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  // 現在のサイズでアップデート
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // カメラのアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // レンダラーのアップデート
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

// アニメーション
const animate = () => {
  renderer.render(scene, camera);
  // controls.update();
  window.requestAnimationFrame(animate);
};

animate();
