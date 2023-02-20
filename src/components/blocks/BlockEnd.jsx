import { RigidBody } from '@react-three/rapier'
import { useGLTF } from '@react-three/drei'
import { boxGeometry, floorMaterial1 } from './BlockSource'


function BlockEnd({ position=[ 0, 0, 0 ] }){

    const hamburger = useGLTF( './hamburger.glb' )
    
    hamburger.scene.children.forEach(( mesh )=>{
        mesh.castShadow = true
    })

    return <group position={ position }>
        <mesh 
            geometry = { boxGeometry } 
            material = { floorMaterial1 }
            position-y = { 0 } 
            scale = { [4,0.2, 4] } 
            receiveShadow  
        />
        <RigidBody
            type = "fixed"
            colliders = "hull"
            position = { [ 0, 0.25, 0 ] }
            restitution = { 0.2 }
            friction = { 0 }
        >
            <primitive object = { hamburger.scene } scale = { 0.2 } />
        </RigidBody>
    </group>
}

export default BlockEnd