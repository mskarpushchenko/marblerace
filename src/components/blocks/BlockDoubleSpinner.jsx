import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { boxGeometry, floorMaterial2, obstacleMaterial } from './BlockSource'
import ObstacleRigidBody from './ObstacleRigidBody'

function DoubleBlockSpinner({ position = [ 0, 0, 0 ] }){

    const obstacle1 = useRef()
    const obstacle2 = useRef()

    const [ speed ] = useState(( Math.random() + 0.4 ) * ( Math.random() < 0.5 ? - 1 : 1 ))

    useFrame((state)=>{

        const time = state.clock.getElapsedTime()

        const eulerRotation1 = new THREE.Euler( 0 , time * speed, 0)
        const eulerRotation2 = new THREE.Euler( 0 , -( time * speed ), 0)

        const quaternionRotation1 = new THREE.Quaternion()
        const quaternionRotation2 = new THREE.Quaternion()

        quaternionRotation1.setFromEuler(eulerRotation1)
        quaternionRotation2.setFromEuler(eulerRotation2)

        obstacle1.current.setNextKinematicRotation(quaternionRotation1)
        obstacle2.current.setNextKinematicRotation(quaternionRotation2)

    })

    return <group position = {position}>

        <mesh 
            geometry = { boxGeometry } 
            material = { floorMaterial2 }
            position-y = { -0.1 } 
            scale = { [ 4, 0.2, 4 ] } 
            receiveShadow  
        />
        <ObstacleRigidBody
            obstacle = { obstacle1 }
            positionY = { 0.3 }
        >
            <mesh 
                geometry = { boxGeometry }
                material = { obstacleMaterial }
                scale = { [ 3.5, 0.3, 0.3 ] }
                castShadow
                receiveShadow
            />
        </ObstacleRigidBody>
        <ObstacleRigidBody
            obstacle = { obstacle2 }
            positionY = { 0.9 }
        >
            <mesh 
                geometry = { boxGeometry }
                material = { obstacleMaterial }
                scale = { [ 3.5, 0.3, 0.3 ] }
                castShadow
                receiveShadow
            />
        </ObstacleRigidBody>
    </group>
}
export default DoubleBlockSpinner