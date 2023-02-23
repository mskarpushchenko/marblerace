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
		uFrequency:10.0,
		uSpeedCoef:2
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
	uniform vec3 randomFactors;
	uniform float uTime;
	uniform vec3 uColor;
	uniform vec3 uColor1;
	uniform vec3 uColor2;
	uniform float uSpeedCoef;
	

  
	void main() {
		vec2 uv = vUv.xy;
		uv = uv * 2.0 - 1.0;
		

		float mySine = abs(sin((uv.x - uTime/ uSpeedCoef)* 10.0 * 3.14) );
		// float moveSine = mySine + uv.x;
		float myCosine = abs(cos(uv.y * 10.0 * 3.14) );


		// gl_FragColor = vec4(1.0 - vUv.x, 1.0 - vUv.y, 1.0 - vUv.y, 1.0);
		gl_FragColor = vec4(mySine, 0.0, myCosine, 1.0);
		// gl_FragColor = vec4(mySine/ myCosine, 1.0 - uv.x, myCosine, 1.0);

	}

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


