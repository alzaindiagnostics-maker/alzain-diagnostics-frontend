import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER_SOURCE = `
attribute vec2 aPosition;
void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;

uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMouse;

vec3 LIGHT = normalize(vec3(-0.3, 0.2, -0.1));
float FULL_SIZE = 2.0;
float EDGE_SIZE = 0.2;
float PAIR_SIZE = 0.2;

vec3 n3(vec3 n) {
    return fract(cos(dot(n, vec3(813.0, 12.0, 376.0))) * vec3(901.81, 827.46, 615.79));
}

vec3 model(vec3 p) {
    float A = p.z / 3.0 + iTime * 0.25;
    vec3 R = vec3(cos(A), sin(A), 0.0);
    vec3 C = vec3(mod(p.xy + 8.0, 16.0) - 8.0 + R.yx * vec2(1.0, -1.0), fract(p.z) - 0.5);
    float H = min(length(C.xy + R.xy * FULL_SIZE), length(C.xy - R.xy * FULL_SIZE)) * 0.5 - EDGE_SIZE;
    float P = max(length(vec2(dot(C.xy, R.yx * vec2(1.0, -1.0)), C.z)) - PAIR_SIZE, length(C.xy) - FULL_SIZE);
    float T = FULL_SIZE + 0.01 + 2.0 * EDGE_SIZE - length(C.xy);
    return vec3(min(H, P), T, P);
}

vec3 normal(vec3 p) {
    vec2 N = vec2(-0.04, 0.04);
    return normalize(
        model(p + N.xyy).x * N.xyy +
        model(p + N.yxy).x * N.yxy +
        model(p + N.yyx).x * N.yyx +
        model(p + N.xxx).x * N.xxx
    );
}

vec4 raymarch(vec3 p, vec3 d) {
    vec4 M = vec4(p + d * 2.0, 0.0);
    for (int i = 0; i < 100; i++) {
        float S = model(M.xyz).x;
        M += vec4(d, 1.0) * S;
        if (S < 0.01 || M.w > 50.0) break;
    }
    return M;
}

vec3 sky(vec3 d) {
    float L = dot(d, LIGHT);
    return vec3(0.3, 0.5, 0.6) - 0.3 * (-L * 0.5 + 0.5) + exp2(32.0 * (L - 1.0));
}

vec3 color(vec3 p, vec3 d) {
    vec2 M = model(p).yz;
    float A = atan(mod(p.y + 8.0, 16.0) - 8.0, 8.0 - mod(p.x + 8.0, 16.0));
    float T1 = ceil(fract(cos(floor(p.z) * 274.63)) - 0.5);
    float T2 = sign(fract(cos(floor(p.z - 80.0) * 982.51)) - 0.5);
    float T3 = T2 * sign(cos(p.z / 3.0 + iTime * 0.25 + A));
    float L = dot(normal(p), LIGHT) * 0.5 + 0.5;
    float R = max(dot(reflect(d, normal(p)), LIGHT), 0.0);
    vec3 C = mix(mix(vec3(0.9 - 0.8 * T3, 0.9 - 0.6 * T3, T3), vec3(1.0 - 0.6 * T3, 0.2 + 0.8 * T3, 0.1 * T3), T1), vec3(0.2), step(0.01, M.y));
    C = mix(C, vec3(0.2, 0.5, 1.0), step(0.01, -M.x));
    return C * L + pow(R, 16.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 A = iMouse.xy / iResolution.xy * vec2(2.0, 1.0) * 3.1416;
    vec3 D = vec3(cos(A.x) * sin(A.y), sin(A.x) * sin(A.y), cos(A.y));
    D = mix(vec3(1.0, 0.0, 0.0), D, ceil((A.x + A.y) / 10.0));
    vec3 P = D * 12.0 - vec3(0.0, 0.0, iTime * 2.0);
    vec3 X = normalize(-D);
    vec3 Y = normalize(cross(X, vec3(0.0, 0.0, 1.0)));
    vec3 Z = normalize(cross(X, Y));
    vec2 UV = (fragCoord.xy - iResolution.xy * 0.5) / iResolution.y;
    vec3 R = normalize(mat3(X, Y, Z) * vec3(1.0, UV));
    vec4 M = raymarch(P, R);
    vec3 C = mix(color(M.xyz, R), sky(R), smoothstep(0.5, 1.0, M.w / 50.0));
    fragColor = vec4(C, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

export default function ShaderBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, clickX: 0, clickY: 0, isDown: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported for ShaderBackground');
      return;
    }

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full screen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]),
      gl.STATIC_DRAW
    );

    const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLoc = gl.getUniformLocation(program, 'iResolution');
    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iMouseLoc = gl.getUniformLocation(program, 'iMouse');

    let animationFrameId;
    const startTime = performance.now();

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const displayWidth = Math.floor(canvas.clientWidth * dpr);
      const displayHeight = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Global mouse/touch interaction listener
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const x = (e.clientX - rect.left) * dpr;
      const y = (rect.height - (e.clientY - rect.top)) * dpr;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
    };

    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const x = (e.clientX - rect.left) * dpr;
      const y = (rect.height - (e.clientY - rect.top)) * dpr;
      mouseRef.current.isDown = true;
      mouseRef.current.clickX = x;
      mouseRef.current.clickY = y;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const render = () => {
      const currentTime = (performance.now() - startTime) / 1000.0;

      gl.useProgram(program);
      gl.uniform3f(iResolutionLoc, canvas.width, canvas.height, 1.0);
      gl.uniform1f(iTimeLoc, currentTime);
      gl.uniform4f(
        iMouseLoc,
        mouseRef.current.x,
        mouseRef.current.y,
        mouseRef.current.isDown ? mouseRef.current.clickX : -mouseRef.current.clickX,
        mouseRef.current.isDown ? mouseRef.current.clickY : -mouseRef.current.clickY
      );

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);

      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}
