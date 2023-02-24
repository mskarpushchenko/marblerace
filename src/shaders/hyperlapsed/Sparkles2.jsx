import * as THREE from "three"
import { useRef, useState } from "react"
import { extend, useFrame } from "@react-three/fiber"
import { shaderMaterial, useTexture } from "@react-three/drei"
import useGame from "../../stores/useGame"


const HyperlapsedMaterial = shaderMaterial(
	{ 
		uTime: 1,
		uFrequency:1.0,
		uSpeedCoef:2,
		uDirection: 1
	},
	/* glsl */`
	uniform float uTime;
	varying vec2 vUv;

	void main()	{

		vUv = uv;

		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);


	}
	`,
	/* glsl */`

	varying vec2 vUv;
	uniform float uFrequency;
	uniform float uTime;
	uniform float uSpeedCoef;
	uniform float uDirection;

	vec4 permute(vec4 x) {
		return mod(((x * 34.0) + 1.0) * x, 289.0);
	}

	vec2 fade(vec2 t) {
		return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
	}

	float cnoise(vec2 P) {
		vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
		vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
		Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
		vec4 ix = Pi.xzxz;
		vec4 iy = Pi.yyww;
		vec4 fx = Pf.xzxz;
		vec4 fy = Pf.yyww;
		vec4 i = permute(permute(ix) + iy);
		vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
		vec4 gy = abs(gx) - 0.5;
		vec4 tx = floor(gx + 0.5);
		gx = gx - tx;
		vec2 g00 = vec2(gx.x, gy.x);
		vec2 g10 = vec2(gx.y, gy.y);
		vec2 g01 = vec2(gx.z, gy.z);
		vec2 g11 = vec2(gx.w, gy.w);
		vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
		g00 *= norm.x;
		g01 *= norm.y;
		g10 *= norm.z;
		g11 *= norm.w;
		float n00 = dot(g00, vec2(fx.x, fy.x));
		float n10 = dot(g10, vec2(fx.y, fy.y));
		float n01 = dot(g01, vec2(fx.z, fy.z));
		float n11 = dot(g11, vec2(fx.w, fy.w));
		vec2 fade_xy = fade(Pf.xy);
		vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
		float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
		return 2.3 * n_xy;
	}
	

  
	void main() {


		vec2 uv = vUv.xy;
		uv = uv * 2.0 - 1.0;

		//офигенные ромбы
		// float mySine = abs(sin((uv.x - uTime/ uSpeedCoef)* 1.0 * 3.14) );
		// float myCosine = abs(cos(uv.y * 1.0 * 3.14) );
		// gl_FragColor = vec4(mySine/ myCosine, 1.0 - uv.x, myCosine, 1.0);
		


		// -------------------
		// float mySine = abs(sin((uv.x - uTime/ uSpeedCoef)*uFrequency * 3.14) );
		// float myCosine = abs(cos(uv.y * 1.0 - uFrequency * 3.14) );

		//  красивый градиент
		// gl_FragColor = vec4(1.0 - vUv.x, 1.0 - vUv.y, 1.0 - vUv.y, 1.0);

		// градиент полосковй интерполярный ездящий
		// gl_FragColor = vec4(mySine, 0.0, myCosine, 1.0);

		// вариация ромбовидного градиента ездящего
		// gl_FragColor = vec4(mySine/ myCosine, 1.0 - uv.x, myCosine, 1.0);
		// -----------------
		// вырезанные круги и квадраты
		// float dist  = distance( uv, vec2(0));
		// float stepOfst = step(0.5, dist);

		// vec4 color =  vec4(0.0, 0.0 , 0.0, 1.0);
		// color.r = dist;
		// // color.b = 1.0 - stepOfst;

		// vec2 distSquare = abs(uv);
		// float square = max(distSquare.x, distSquare.y);
		// color.b = step(0.5, square);
		//------------------
		// линиигиперлапса
		vec2 argsNoise1 =  uv * vec2(1.0 , 20.0) + vec2(uDirection * uTime, 0.0)  ;
		vec2 argsNoise2 =  uv * vec2(1.0 , 20.0) + vec2(uDirection * uTime+ 0.05, 0.0);

		float noise1  = cnoise(argsNoise1);
		float noise2 = cnoise(argsNoise2);

		vec4 color =  vec4(0.0, 0.0 , 1.0, 1.0);
		color.r = noise1;
		color.b = noise2;
		// ----------------------
		// классные линии вертикальные пятнистые
		// vec2 argsNoise1 =  uv * vec2(200.0 , 1.0) + vec2(0.0, uTime);
		// vec2 argsNoise2 =  uv * vec2(200.0 , 1.0) + vec2(0.0, uTime+ 0.05);

		// float noise1  = cnoise(argsNoise1);
		// float noise2 = cnoise(argsNoise2);

		// vec4 color =  vec4(0.0, 0.0 , 0.0, 1.0);
		// color.r = noise1;
		// color.b = noise2;
		// -------------------------
		// умножение юв
		// uv = uv * 5.0;
		// uv = fract(uv);

		// vec2 argsNoise1 =  uv *vec2(1.0 , 20.0) + vec2(uTime, 0.0)  ;
		// vec2 argsNoise2 =  uv * vec2(1.0 , 20.0) + vec2(uTime+ 0.05, 0.0);

		// float noise1  = cnoise(argsNoise1);
		// float noise2 = cnoise(argsNoise2);

		// vec4 color =  vec4(0.0, 0.0 , 1.0, 1.0);
		// color.r = noise1;
		// color.b = noise2;
		gl_FragColor = color;


	}

	`
)
  
  extend({ HyperlapsedMaterial })

 export default function Hyperlapse( { direction } ) {

	const state = useGame.getState()
	const ref = useRef()

	useFrame(({clock}) => {

		let elapsedTime = 0

		if(state.phase === 'playing'){
			
			ref.current.uTime =  clock.getElapsedTime()

		} 

		})

	return <>

		<hyperlapsedMaterial ref={ref} repeats={3} vertexColors depthWrite={false} uDirection={ direction } />
	</>
	
	}


