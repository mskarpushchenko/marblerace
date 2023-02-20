import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { isMobile } from 'react-device-detect';
import Experience from './Experience.jsx'
import { KeyboardControls } from '@react-three/drei'
import Interface from './Interface'

const root = ReactDOM.createRoot(document.querySelector('#root'))

let cameraConfig = {

    fov: 45,
    near: 0.1,
    far: 200,
    position: [ 2.5, 4, 6 ]
}
if( isMobile){

     cameraConfig = {
        fov: 75,
        near: 0.1,
        far: 100,
        position: [ 2.5, 4, 6 ]
    }
}

root.render(


    <KeyboardControls
    map ={[
        {name:'forward', keys:['ArrowUp', 'KeyW']},
        {name:'backward', keys:['ArrowDown', 'KeyS']},
        {name:'leftward', keys:['ArrowLeft', 'KeyA']},
        {name:'rightward', keys:['ArrowRight', 'KeyD']},
        {name:'jump', keys:['Space']}
    ]}
    >

        <Canvas 
            shadows
            camera={ cameraConfig }
            // onDoubleClick={handleDoubleClick}
        >
            <Experience />
        </Canvas>
        <Interface />
        
    </KeyboardControls>

)