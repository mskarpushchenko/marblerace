import * as THREE from "three"
import { useRef, useState } from "react"
import { extend, useFrame } from "@react-three/fiber"
import { shaderMaterial, useTexture } from "@react-three/drei"
import useGame from "../../stores/useGame"


const HyperlapsedMaterial = shaderMaterial(
	{ 
		randomFactors: [1, 1, 1],
		uTime: 1,
		uColor: new THREE.Color(28.0, 46.0, 61.0),
		uColor1: new THREE.Color(232.0, 89.0, 78.0),
		uColor2: new THREE.Color(115.0, 175.0, 186.0),
		u_mouse: new THREE.Vector2(1.0, 1.0),
		u_resolution: new THREE.Vector2(1000.0, 800.0),
	},
	/* glsl */`

	varying vec2 vUv;

	void main()	{

		vUv = uv;

		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);

	}
	`,
	/* glsl */`

	varying vec2 vUv;
	uniform vec3 randomFactors;
	uniform float uTime;
	uniform vec3 uColor;
	uniform vec3 uColor1;
	uniform vec3 uColor2;
  
	float random(vec2 st)
	{
		return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
	}
	float random (in float x) {
   		return fract(sin(x)*1e4);
	}
  
	void main() {

		// vec2 gridUv = vec2(floor(sin(vUv.x+ uTime) * -1.0) , floor(vUv.y  * (randomFactors.y * 10.0)) / (randomFactors.y * 1.0));
		// vec2 gridUv = vec2(floor(vUv.x* uTime * (randomFactors.x * 10.0)) / (randomFactors.x * 1.0), floor(vUv.y*uTime * (randomFactors.y * 10.0)) / (randomFactors.y * 1.0));


		float strength = random(gridUv);
		float randFloat = random(vUv * 100.0);
		

		// 0...1 = [0.0, 0.33] [0.34, 0.66] [0.66, 1] 
		// 0 10 20 32
		// 33 40 50 65
		// 66 ... 100


		vec3 colorsList[3] = vec3[3](uColor, uColor1, uColor2);

		int colorIndex  = int(strength * 3.0);

		vec3 randColor = colorsList[colorIndex];

		// gl_FragColor = vec4(vec3(strength), 1.0);
		// vec3 newColor = vec3 uColor * strength;
		// strength = 0.5;
		float reducedStrength = strength /150.0 ;
		gl_FragColor = vec4(randColor.r * reducedStrength, randColor.g * reducedStrength, randColor.b * reducedStrength, 1.0);
	}
// 	#ifdef GL_ES
// 		precision mediump float;
// 	#endif
// 	uniform vec2 u_resolution;
// uniform vec2 u_mouse;
// uniform float uTime;

// float random (in float x) {
//     return fract(sin(x)*1e4);
// }

// float random (in vec2 st) {
//     return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
// }

// float pattern(vec2 st, vec2 v, float t) {
//     vec2 p = floor(st+v);
//     return step(t, random(100.+p*.000001)+random(p.x)*0.5 );
// }

// void main() {
//     vec2 st = gl_FragCoord.xy/u_resolution.xy;
//     st.x *= u_resolution.x/u_resolution.y;

//     vec2 grid = vec2(100.0,50.);
//     st *= grid;

//     vec2 ipos = floor(st);  // integer
//     vec2 fpos = fract(st);  // fraction

//     vec2 vel = vec2(uTime*2.*max(grid.x,grid.y)); // time
//     vel *= vec2(-1.,0.0) * random(1.0+ipos.y); // direction

//     // Assign a random value base on the integer coord
//     vec2 offset = vec2(0.1,0.);

//     vec3 color = vec3(0.);
//     color.r = pattern(st+offset,vel,0.5+u_mouse.x/u_resolution.x);
//     color.g = pattern(st,vel,0.5+u_mouse.x/u_resolution.x);
//     color.b = pattern(st-offset,vel,0.5+u_mouse.x/u_resolution.x);

//     // Margins
//     color *= step(0.2,fpos.y);

//     gl_FragColor = vec4(1.0-color,1.0);
// }

	`
)
  
  extend({ HyperlapsedMaterial })

 export default function Hyperlapse() {

	const ref = useRef()
	useFrame(({clock}) => (ref.current.uTime = clock.getElapsedTime()))
	// const map = useTexture(`https://source.unsplash.com/random/400x400`)

	return <>

		<hyperlapsedMaterial ref={ref} repeats={3} vertexColors depthWrite={false}  />
	</>
	
	}


