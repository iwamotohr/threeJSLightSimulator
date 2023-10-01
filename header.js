import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader.js";

/**
 * キャンバスを取得
 */
const headerCanvas = document.querySelector(".headerWebgl");

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
camera.position.y = 0;
camera.position.z = 6;
scene.add(camera);

// レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: headerCanvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

/**
 * カメラ制御
 */
new OrbitControls(camera, renderer.domElement);

/**
 * オブジェクトの追加
 */
// 反射壁
// ジオメトリ
const wallPlaneGeometry = new THREE.PlaneGeometry(100, 100, 1);

const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x000000,
});
// メッシュ化
const wallBack = new THREE.Mesh(wallPlaneGeometry, wallMaterial);
wallBack.position.set(0, 0, -10);
wallBack.receiveShadow = true;
scene.add(wallBack);

// テクスチャ設定
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/particles/1.png");

// パーティクルの追加
// ジオメトリ
const particlesGeometry = new THREE.BufferGeometry();
const count = 1000;
const positionArray = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 20;
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
// マテリアル
const pointMaterial = new THREE.PointsMaterial({
  size: 0.2,
  sizeAttenuation: true,
  transparent: true,
  alphaMap: particleTexture,
});
// メッシュ化
const particles = new THREE.Points(particlesGeometry, pointMaterial);
scene.add(particles);
/**
 * 照明の追加
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 50, 300, 3);
pointLight.position.set(0, 0, -9);
pointLight.shadowMapWidth = 2048;
pointLight.shadowMapHeight = 2048;
pointLight.castShadow = true;
scene.add(pointLight);

const spotLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// scene.add(spotLightHelper);

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

/**
 * マウス操作連動
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = (event.clientX / sizes.width) * 20 - 10;
  cursor.y = (event.clientY / sizes.height) * 20 - 10;
});

/**
 * アニメーション
 */
const animate = () => {
  renderer.render(scene, camera);
  // ポイントライトの位置をカーソルと連動
  pointLight.position.x = cursor.x;
  pointLight.position.y = -cursor.y;
  window.requestAnimationFrame(animate);
};

animate();
