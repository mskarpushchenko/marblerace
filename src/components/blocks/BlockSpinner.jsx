import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { boxGeometry, floorMaterial2, obstacleMaterial } from './BlockSource'
import ObstacleRigidBody from './ObstacleRigidBody'
import useGame from '../../stores/useGame'


function BlockSpinner( { position = [ 0, 0, 0 ] } ){

    const obstacle = useRef()
    const difficulty = useGame((state) => state.difficulty)
    const [ speed ] = useState( (Math.random() + 0.4 ) * ( Math.random() < 0.5 ? - 1 : 1  ) * difficulty )
  



    useFrame(( state )=>{

        const time = state.clock.getElapsedTime()

        const eulerRotation = new THREE.Euler( 0 , time * speed, 0)

        const quaternionRotation = new THREE.Quaternion()

        quaternionRotation.setFromEuler( eulerRotation )

        obstacle.current.setNextKinematicRotation( quaternionRotation )

    })

    return <group position={ position } >

        <mesh 
            geometry = { boxGeometry } 
            material = { floorMaterial2 }
            position-y = { -0.1 } 
            scale = { [ 4, 0.2, 4 ] } 
            receiveShadow  
        />
        <ObstacleRigidBody
            obstacle = { obstacle }
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
    </group>
}

export default BlockSpinner