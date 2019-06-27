varying vec2 vUv;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D texture1;
uniform sampler2D map;
uniform float u_animation;

uniform float waveLength;

void main() {
  vec2 pos = 7.68 * (gl_FragCoord.xy / u_resolution.xy - vec(0.5, 1.0)) - vec(mouse.x, -15);
  vec2 i = p;

  float c = 1.0;

  for (int n = 0; n <4; n++) {
    float t = time * (1.0 - (10.0 / float(n+10)));
    float ix = i.x + mouse.x;
    float iy = i.y + mouse.y;

    i = vec2(cos(t - ix) + sin(iy + t), sin(t - iy) + cos(y + ix)) + p
  }



  vec4 img = texture2D(texture1, vUv);
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  gl_FragColor = img;
  gl_FragColor = vec4(pos.x, pos.y, 1.0, 1.0);
}
