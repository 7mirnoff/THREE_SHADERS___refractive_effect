varying vec2 vUv;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D texture;
uniform sampler2D map;
uniform float u_animation;

void main() {
  // ===== градиент начало =====
  // vec2 st = gl_FragCoord.xy / u_resolution.xy;
  // gl_FragColor = vec4(st.x, st.y, 0.0, 1.0);
  // ===== градиент конец ====

  // ===== мигалка начало =====
  // gl_FragColor = vec4(abs(sin(u_time)), 0.0, 0.0, 1.0);
  // ===== мигалка конец =====

  // ===== складывание векторов начало =====
  // gl_FragColor = vec4( vec3(1.0, 0.0, 1.0), 1.0);
  // ===== складывание векторов конец =====

  // ===== искажения =====
  float m = u_mouse.x / u_resolution.x;

  float distort = sin(vUv.y * 100.0 + u_time) * 0.0015 + m * 0.3;

  float map = texture2D(map, vUv).r;
  vec4 texture = texture2D(texture, vec2(vUv.x + distort*map, vUv.y));

  // gl_FragColor = vec4( vec3(1.0, 0.0, 1.0), 1.0);

  // ===== чернобелое изображение =====
  // gl_FragColor = vec4(vec3(texture.r * 0.2126 + texture.g * 0.7152+ texture.g * 0.0722), 1.0);

  gl_FragColor = vec4(texture.rgb, 1.0)
}
