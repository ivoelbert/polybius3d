

THREE.JulShader = {

	uniforms: {

		"tDiffuse": { value: null },
    "cshift":   { value: 0.01 },
    "time":   { value: 0 },
    "mouseX":   { value: 0 },
    "dispLength": { value: 1 }

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
    "uniform float time;",
    "uniform float mouseX;",
    "uniform float dispLength;",
		"varying vec2 vUv;",

    "float quadInOut(float t) {",
    "float p = 2.0 * t * t;",
    "return t < 0.5 ? p : -p + (4.0 * t) - 1.0;",
    "}",

    "float myEase(float x) {",
    "  return x + sin(x * 2.0 * 3.14159) * 0.1;",
    "}",

    "float mapLin(float value, float istart, float istop, float ostart, float ostop) {",
    "  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));",
    "}",

		"void main() {",

      "float nx = 0.0;",
      "float left = clamp((mouseX - dispLength / 2.0), 0.0, 1.0);",
      "float right = clamp((mouseX + dispLength / 2.0), 0.0, 1.0);",
      "if(vUv.x < left) {",
      "  nx = vUv.x;",
      "} else if(vUv.x > right) {",
      "  nx = vUv.x;",
      "} else {",
      "  float normX = mapLin(vUv.x, left, right, 0.0, 1.0);",
      "  float easedX = myEase(normX);",
      "  float normEasedX = mapLin(easedX, 0.0, 1.0, left, right);",
      "  nx = normEasedX;",
      "}",
      "vec2 nUv = vec2(nx, vUv.y);",
      "vec2 dir = nUv - vec2(0.5, 0.5);",
      "float amp = clamp(length(dir) - 0.1, 0.1, 1.0);",
      "vec2 offset = amp * cshift * normalize(dir);",

			"vec4 cr = texture2D(tDiffuse, nUv + offset);",
			"vec4 cga = texture2D(tDiffuse, nUv);",
			"vec4 cb = texture2D(tDiffuse, nUv - offset);",

			"gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);",

		"}"

	].join( "\n" )


};
