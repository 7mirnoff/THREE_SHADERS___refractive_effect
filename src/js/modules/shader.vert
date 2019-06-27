varying vec2 vUv;
uniform vec2 u_size;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
varying vec4 vPosition;
uniform float waveLength;
void main() {
  // растягивает изоюражение на весь экран
  vUv = uv;

  lowp float vWave = sin(u_time + (position.x + position.y) * waveLength);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x - u_mouse.y * 0.06, position.y + u_mouse.x * 0.06, vWave * 0.03, 1.0 );

  // сохранет пропорции изображения
  // gl_Position = vec4(position, 1.0);
}

