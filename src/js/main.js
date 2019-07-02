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

let Mytexture1 = loader.load('../img/img1.jpg', startRender)
let MyTexture2 = loader.load('../img/img2.jpg')
let MyTexture3 = loader.load('../img/img3.jpg')
let MyTexture4 = loader.load('../img/img4.jpg')

const textureArray = [Mytexture1, MyTexture2, MyTexture3, MyTexture4]

let material

function init () {
  document.onmousemove = getMouseXY

  function getMouseXY (e) {
    mouse.x = e.pageX
    mouse.y = e.pageY
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
      value: new THREE.Vector2(textureArray[0].image.width, textureArray[0].image.height)
    },
    texture: {
      value: textureArray[0]
    },
    waveLength: {
      type: 'f',
      value: 5.0
    },
    ratio: {
      type: 'f',
      value: 1
    }
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

  // controls = new OrbitControls(camera, renderer.domElement)
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
    mesh.scale.x = mesh.scale.y = w / h * 1.15
  }

  camera.updateProjectionMatrix()
}

function animate () {
  window.requestAnimationFrame(animate)
  render()
}

function render () {
  material.uniforms.u_mouse.value.x += ((destination.x - material.uniforms.u_mouse.value.x) * 0.06) // последний множитель дистанция смещения мышью
  material.uniforms.u_mouse.value.y += ((destination.y - material.uniforms.u_mouse.value.y) * 0.06) // последний множитель дистанция смещения мышью

  material.uniforms.u_time.value += 0.05
  renderer.render(scene, camera)
}

let counter = 0
let isAnimating = false

document.addEventListener('click', function () {
  if (isAnimating) return
  isAnimating = true

  if (counter <= 2) {
    counter++
  } else {
    counter = 0
  }

  let tl = new TimelineMax({onComplete: function () { isAnimating = false }})
  tl
    .to(material.uniforms.waveLength, 0.8, {
      value: 22
    })
    .to(material.uniforms.ratio, 0.3, {
      value: 0,
      onComplete: function () {
        material.uniforms.texture.value = textureArray[counter]
        material.uniforms.u_size.value = new THREE.Vector2(textureArray[counter].image.width, textureArray[counter].image.height)
      }
    })
    .to(material.uniforms.ratio, 0.3, {
      value: 1
    })
    .to(material.uniforms.waveLength, 0.5, {
      value: 3
    }, 0.5)
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
