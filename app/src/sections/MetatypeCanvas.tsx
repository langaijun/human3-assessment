import { useEffect, useRef, useState } from 'react';
import type { AssessmentResult } from '@/types';

interface MetatypeCanvasProps {
  result: AssessmentResult;
  onComplete: () => void;
}

const BG = '#FDF6E3';
const TEXT = '#3D3229';
const TEXT_MUTED = '#8C7E6A';

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_mind;
uniform float u_body;
uniform float u_spirit;
uniform float u_vocation;

vec3 palette(float t) {
  vec3 a = vec3(0.5, 0.5, 0.4);
  vec3 b = vec3(0.5, 0.5, 0.4);
  vec3 c = vec3(1.0, 1.0, 0.9);
  vec3 d = vec3(0.25, 0.3, 0.45) + vec3(u_spirit * 0.12, u_vocation * 0.06, u_mind * 0.15);
  return a + b * cos(6.28318 * (c * t + d));
}

float spiralDist(vec2 uv, float arms, float tightness) {
  float r = length(uv);
  float angle = atan(uv.y, uv.x);
  float spiralAngle = r * tightness + u_time * 0.1 * u_vocation;
  float sd = abs(fract((spiralAngle - angle) / (6.28318 / arms)) - 0.5);
  return sd * 2.0 * r;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);

  vec2 uvFinal = uv;
  uvFinal += vec2(sin(uv.y * 3.0 + u_time * 0.2), cos(uv.x * 3.0 + u_time * 0.2)) * 0.1 * u_mind;

  vec2 uv0 = uvFinal;
  vec3 finalColor = vec3(0.0);
  float i = 0.0;

  for (int iter = 0; iter < 3; iter++) {
    uvFinal = fract(uvFinal * (1.5 + u_body * 0.5)) - 0.5;
    float d = spiralDist(uvFinal, 3.0 + u_mind * 4.0, 2.0 + u_vocation * 2.0) * exp(-length(uv0));
    vec3 col = palette(length(uv0) + i * 0.4 + u_time * 0.1);
    d = sin(d * 8.0 + u_time * 0.3) / 8.0;
    d = abs(d);
    d = pow(0.01 / d, 1.2);
    finalColor += col * d;
    i += 1.0;
  }

  finalColor = finalColor / (1.0 + finalColor);
  // Warmer, softer tone for cream background
  finalColor = pow(finalColor, vec3(0.85));
  finalColor += vec3(0.05, 0.03, 0.0);
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const CYCLE_WORDS = [
  '分析中...',
  '整合数据...',
  '构建模型...',
  '生成图谱...',
  '校准维度...',
  '显化中...',
];

export default function MetatypeCanvas({ result, onComplete }: MetatypeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  const [currentWord, setCurrentWord] = useState(CYCLE_WORDS[0]);
  const scoresRef = useRef({ mind: 0.5, body: 0.5, spirit: 0.5, vocation: 0.5 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord(prev => {
        const idx = CYCLE_WORDS.indexOf(prev);
        return CYCLE_WORDS[(idx + 1) % CYCLE_WORDS.length];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = result.dimensionScores;
    const duration = 12000;
    const start = Date.now();
    const startScores = { ...scoresRef.current };

    const animateScores = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      scoresRef.current = {
        mind: startScores.mind + (target.mind - startScores.mind) * ease,
        body: startScores.body + (target.body - startScores.body) * ease,
        spirit: startScores.spirit + (target.spirit - startScores.spirit) * ease,
        vocation: startScores.vocation + (target.vocation - startScores.vocation) * ease,
      };

      if (progress < 1) {
        requestAnimationFrame(animateScores);
      } else {
        setTimeout(() => onComplete(), 3000);
      }
    };

    const timer = setTimeout(() => requestAnimationFrame(animateScores), 2000);
    return () => clearTimeout(timer);
  }, [result, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    startTimeRef.current = Date.now();

    const render = () => {
      const time = (Date.now() - startTimeRef.current) / 1000;
      const scores = scoresRef.current;

      gl.uniform1f(gl.getUniformLocation(program, 'u_time'), time);
      gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.height);
      gl.uniform1f(gl.getUniformLocation(program, 'u_mind'), scores.mind);
      gl.uniform1f(gl.getUniformLocation(program, 'u_body'), scores.body);
      gl.uniform1f(gl.getUniformLocation(program, 'u_spirit'), scores.spirit);
      gl.uniform1f(gl.getUniformLocation(program, 'u_vocation'), scores.vocation);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center" style={{ background: BG }}>
      <div className="text-center mb-8 z-10">
        <p className="text-sm mb-2" style={{ color: TEXT_MUTED }}>正在合成你的人格元类型</p>
        <p className="text-base font-medium transition-all duration-500" style={{ color: TEXT }}>
          {currentWord}
        </p>
      </div>

      <div className="relative w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] md:w-[40vh] md:h-[40vh]">
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '16px',
          }}
        />
        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: '1px solid #E8DCC8' }} />
      </div>

      <div className="flex gap-8 mt-8 z-10">
        {([
          { key: 'mind', label: '心智', color: '#7E57C2' },
          { key: 'body', label: '身体', color: '#5A8F5A' },
          { key: 'spirit', label: '灵性', color: '#8B7EC8' },
          { key: 'vocation', label: '职业', color: '#C4956A' },
        ] as const).map(({ key, label, color }) => (
          <div key={key} className="text-center">
            <p className="text-xs" style={{ color: TEXT_MUTED }}>{label}</p>
            <p className="text-sm font-mono-code font-medium" style={{ color }}>
              {Math.round(scoresRef.current[key as keyof typeof scoresRef.current] * 100)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
