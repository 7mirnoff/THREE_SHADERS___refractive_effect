import * as THREE from 'three'
import './modules/polyfill'

import vertexShader from './modules/shader.vert'
import fragmentShader from './modules/shader.frag'

let container
let camera, scene, renderer
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

let MyTexture = loader.load('../img/water.jpg', startRender)

function getMouseXY (e) {
  mouse.x = e.pageX
  mouse.y = e.pageY
  uniforms.u_mouse.value.x = mouse.x
  uniforms.u_mouse.value.y = mouse.y
}

function init () {
  container = document.getElementById('container')

  camera = new THREE.Camera()
  camera.position.z = 1
  scene = new THREE.Scene()
  let geometry = new THREE.PlaneBufferGeometry(2, 2)

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
    },
    map: {
      value: loader.load('../img/water-map.jpg')
    }
  }

  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })

  let mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)

  container.appendChild(renderer.domElement)
  onWindowResize()
  window.addEventListener('resize', onWindowResize, false)
}

function onWindowResize (event) {
  renderer.setSize(window.innerWidth, window.innerHeight)
  uniforms.u_resolution.value.x = renderer.domElement.width
  uniforms.u_resolution.value.y = renderer.domElement.height
  uniforms.u_mouse.value.x = mouse.x
  uniforms.u_mouse.value.y = mouse.y
}

function animate () {
  requestAnimationFrame(animate)
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
