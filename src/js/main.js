import * as THREE from 'three'
const OrbitControls = require(`three-orbit-controls`)(THREE)
import './modules/polyfill'

import vertexShader from './modules/shader.vert'
import fragmentShader from './modules/shader.frag'
import { Plane } from 'three';

let container
let camera, scene, renderer, controls, mesh
let uniforms
let mouse = {
  x: 0,
  y: 0
}
let loader = new THREE.TextureLoader()
document.onmousemove = getMouseXY

const startRender = () => {
  init()
  animate()
}

let MyTexture = loader.load('../img/img1.jpg', startRender)

function getMouseXY (e) {
  mouse.x = e.pageX
  mouse.y = e.pageY
  uniforms.u_mouse.value.x = mouse.x
  uniforms.u_mouse.value.y = mouse.y
}

function init () {
  container = document.getElementById('container')

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 100)
  camera.position.set(0, 0, 1)
  scene = new THREE.Scene()
  let geometry = new THREE.PlaneBufferGeometry(1, 1, 64, 64)

  uniforms = {
    u_time: {
      type: 'f',
      value: 1.0
    },
    u_animation: {
      type: 'f',
      value: 0.0
    },
    u_mouse: {
      type: 'v2',
      value: new THREE.Vector2()
    },
    u_resolution: {
      type: 'v2',
      value: new THREE.Vector2()
    },
    u_size: {
      type: 'v2',
      value: new THREE.Vector2(MyTexture.image.width, MyTexture.image.height)
    },
    texture: {
      value: MyTexture
    }
    // map: {
    //   value: loader.load('../img/water-map.jpg')
    // }
  }

  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    // wireframe: true,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })

  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)

  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  onWindowResize()
  window.addEventListener('resize', onWindowResize)
}

function onWindowResize (event) {
  let w = window.innerWidth
  let h = window.innerHeight
  renderer.setSize(w, h)
  camera.aspect = w / h
  let dist = camera.position.z - mesh.position.z
  let height = 1
  camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist))

  if (w / h > 1) {
    mesh.scale.x = mesh.scale.y = w / h
  }

  camera.updateProjectionMatrix()
}

function animate () {
  window.requestAnimationFrame(animate)
  render()
}

function render () {
  uniforms.u_time.value += 0.05
  renderer.render(scene, camera)
}
document.addEventListener('click', function () {
  // let tl = new TimelineMax()
  // tl
  //   .to(uniforms.u_animation, 3, {
  //     value: 1,
  //     ease: Power3.easeInOut
  //   })
})
