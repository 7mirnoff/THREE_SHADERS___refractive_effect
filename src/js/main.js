import * as THREE from 'three'
const OrbitControls = require(`three-orbit-controls`)(THREE)
import './modules/polyfill'

import {
  TimelineMax
} from "gsap/all"

import vertexShader from './modules/shader.vert'
import fragmentShader from './modules/shader.frag'
import {
  Plane
} from 'three';

let container
let camera, scene, renderer, controls, mesh
let destination = {
  x: 0,
  y: 0
}
let uniforms
let mouse = {
  x: 0,
  y: 0
}
let loader = new THREE.TextureLoader()

const startRender = () => {
  init()
  animate()
}

let MyTexture = loader.load('../img/img2.jpg', startRender)
let material

function init () {
  document.onmousemove = getMouseXY

  function getMouseXY (e) {
    mouse.x = e.pageX
    mouse.y = e.pageY
    // material.uniforms.u_mouse.value.x = mouse.x
    // material.uniforms.u_mouse.value.y = mouse.y
  }

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
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    u_size: {
      type: 'v2',
      value: new THREE.Vector2(MyTexture.image.width, MyTexture.image.height)
    },
    texture1: {
      value: MyTexture
    },
    waveLength: {
      type: 'f',
      value: 5.0
    }
    // map: {
    //   value: loader.load('../img/water-map.jpg')
    // }
  }

  material = new THREE.ShaderMaterial({
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
    mesh.scale.x = mesh.scale.y = w / h * 1.05
  }

  camera.updateProjectionMatrix()
}

function animate () {
  window.requestAnimationFrame(animate)
  render()
}

function render () {
  material.uniforms.u_mouse.value.x += ((destination.x - material.uniforms.u_mouse.value.x) * 0.02)
  material.uniforms.u_mouse.value.y += ((destination.y - material.uniforms.u_mouse.value.y) * 0.02)

  material.uniforms.u_time.value += 0.05
  renderer.render(scene, camera)
}

document.addEventListener('click', function () {
  let tl = new TimelineMax()
  tl
    .to(material.uniforms.waveLength, 0.5, {
      value: 22
    })
    .to(material.uniforms.waveLength, 0.5, {
      value: 5
    })
})

let vw = window.innerWidth
let vh = window.innerHeight

function onMouseMove (evt) {
  let x = (evt.clientX - vw / 2) / (vw / 2)
  let y = (evt.clientY - vh / 2) / (vh / 2)
  destination.x = y
  destination.y = x
}

window.addEventListener(`mousemove`, onMouseMove)
