/**
 * @author felixturner / http://airtight.cc/
 *
 * RGB Shift Shader
 * Shifts red and blue channels from center in opposite directions
 * Ported from http://kriss.cx/tom/2009/05/rgb-shift/
 * by Tom Butterworth / http://kriss.cx/tom/
 *
 * amount: shift distance (1 is width of input)
 * angle: shift angle in radians
 */

THREE.RGBShiftShader = {

	uniforms: {

		"tDiffuse": { value: null },
    "cshift":   { value: 0.02 },
    "waveFreq":   { value: 10*3.14 },
    "waveAmp":   { value: 0.02 },
    "time":   { value: 0 },
    "colorOff": { value: 0.1 },
    "colorFreq": { value: 10 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
    "uniform float cshift;",
    "uniform float waveFreq;",
    "uniform float waveAmp;",
    "uniform float time;",
    "uniform float colorOff;",
    "uniform float colorFreq;",

		"varying vec2 vUv;",

		"void main() {",
      "float px = vUv.x + sin((vUv.y + time) * waveFreq) * waveAmp;",
      "float py = vUv.y + sin((vUv.x + time) * waveFreq) * waveAmp;",
      "vec2 nUv = vec2(px, py);",
      "vec2 dir = nUv - vec2(0.5, 0.5);",
      "float amp = clamp(length(dir) - 0.1, 0.1, 1.0);",
      "vec2 offset = amp * cshift * normalize(dir);",

			"vec4 cr = texture2D(tDiffuse, nUv + offset);",
			"vec4 cga = texture2D(tDiffuse, nUv);",
			"vec4 cb = texture2D(tDiffuse, nUv - offset);",

      "float rOffset = clamp(sin(time * colorFreq), 0.0, 1.0) * colorOff;",
      "float gOffset = clamp(sin(time * colorFreq + 3.14 / 3.0), 0.0, 1.0) * colorOff;",
      "float bOffset = clamp(sin(time * colorFreq + 2.0 * 3.14 / 3.0), 0.0, 1.0) * colorOff;",

			"gl_FragColor = vec4(cr.r + rOffset, cga.g + gOffset, cb.b + bOffset, cga.a);",

		"}"

	].join( "\n" )

  /*
  "uniform sampler2D tDiffuse;",
  "uniform float amount;",
  "uniform float angle;",
  "uniform float cshift;",

  "varying vec2 vUv;",

  "void main() {",
    "vec2 dir = vUv - vec2(0.5, 0.5);",
    "float amp = clamp(length(dir) - 0.1, 0.8, 1.0);",

    "vec2 offset = amp * cshift * normalize(dir);",
    "vec4 cr = texture2D(texture, vUv + offset);",
    "vec4 cga = texture2D(texture, vUv);",
    "vec4 cb = texture2D(texture, vUv - offset);",
    "gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);",

  "}"
  */

};
