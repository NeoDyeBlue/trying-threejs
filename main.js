import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const APP = (function () {
  document.addEventListener("DOMContentLoaded", init);
  //SCENE
  const scene = new THREE.Scene();
  //LOADER
  // const loader = new GLTFLoader();
  const loader = new OBJLoader();
  const mtlLoader = new MTLLoader();
  //CAMERA
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  //RENDERER
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("three-canvas"),
    // antialias: true,
  });
  //COTNTROLS
  const controls = new OrbitControls(camera, renderer.domElement);
  var model = null;

  function init() {
    sceneSetup();
    addListeners();
    animate();
  }

  function sceneSetup() {
    //lightvars
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7);
    const ambiLight = new THREE.AmbientLight(0xffffff, 0.1);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    const lightHelper = new THREE.DirectionalLightHelper(dirLight);
    //planevars
    var geo = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8);
    var mat = new THREE.MeshPhongMaterial({
      color: 0x4f92ff,
      side: THREE.DoubleSide,
    });
    var plane = new THREE.Mesh(geo, mat);
    //gridvar
    const gridHelper = new THREE.GridHelper(200, 50);

    //test
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // material.castShadow = true;
    // material.receiveShadow = true;
    // cube.castShadow = true;
    // cube.receiveShadow = true;
    // cube.position.setZ(-10);
    // cube.position.setY(5);
    // scene.add(cube);

    //RENDERER SETUP
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    camera.position.setZ(20);
    camera.position.setY(10);

    //LIGHTS SETUP
    hemiLight.position.set(0, 20, 10);
    dirLight.position.set(0, 10, 10);
    dirLight.target.position.set(0, 0, 0);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1000;
    // dirLight.shadow.camera.fov = 30;

    //PLANE SETUP
    mat.receiveShadow = true;
    plane.rotateX(-Math.PI / 2);
    plane.position.setY(-2);
    plane.receiveShadow = true;

    //LOAD MODEL
    // loader.load(
    //   "./3d-models/Tree.glb",
    //   function (gltf) {
    //     // gltf.scenes.forEach((mesh) => (mesh.castShadow = true));
    //     gltf.scene.traverse((model) => {
    //       if (model.isMesh) {
    //         // model.material = new THREE.MeshNormalMaterial();
    //         model.castShadow = true;
    //         model.receiveShadow = true;
    //       }
    //     });
    //     scene.add(gltf.scene);
    //   },
    //   undefined,
    //   function (error) {
    //     console.error(error);
    //   }
    // );
    mtlLoader.load("3d-models/house.mtl", function (materials) {
      materials.preload();
      loader.setMaterials(materials);
      loader.load(
        // resource URL
        "3d-models/house.obj",
        // called when resource is loaded
        function (object) {
          let texture = new THREE.TextureLoader().load(
            "3d-models/house-RGBA.png"
          );
          // // let material = new THREE.MeshPhongMaterial({ map: texture });
          // let model = new THREE.Mesh(object, material);
          object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              // child.material.map = texture;
              // child.material.transparent = true;
            }
          });
          object.castShadow = true;
          object.receiveShadow = true;
          object.rotateY(36.13);
          object.position.setY(-2);
          model = object;
          scene.add(object);
        },
        // called when loading is in progresses
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // called when loading has errors
        function (error) {
          console.log("An error happened");
        }
      );
    });

    //SCENE ADD
    scene.background = new THREE.Color(0x4f92ff);
    scene.add(
      hemiLight,
      // ambiLight,
      dirLight,
      dirLight.target
      // lightHelper,
      // plane
      // gridHelper
      // new THREE.CameraHelper(dirLight.shadow.camera)
    );
  }

  function animate() {
    renderer.render(scene, camera);
    controls.update();
    if (model) {
      model.rotation.y -= 0.001;
    }
    requestAnimationFrame(animate);
  }

  function addListeners() {
    window.addEventListener("resize", function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateWorldMatrix();
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
})();
