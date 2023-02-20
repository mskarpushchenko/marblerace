import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { boxGeometry, floorMaterial2, obstacleMaterial } from './BlockSource'
import useGame from '../../stores/useGame'
import ObstacleRigidBody from './ObstacleRigidBody'

function BlockAxe( { position=[ 0, 0, 0 ] } ){

    const obstacle = useRef()
    const [ timeOffset ] = useState( Math.random() * Math.PI * 2 )
    const difficulty = useGame((state) => state.difficulty)

    useFrame((state)=>{

        const time = state.clock.getElapsedTime()
        const translationX = Math.sin( time * difficulty + timeOffset ) * 1.25

        obstacle.current.setNextKinematicTranslation( 
            { 
                x: position[ 0 ] + translationX,
                y: position[ 1 ] + 0.75,
                z: position[ 2 ] 
            } 
        )

    })

    return <group position={ position }>

        <mesh 
            geometry = { boxGeometry } 
            material = { floorMaterial2 }
            position-y = { -0.1 } 
            scale = { [ 4,0.2, 4 ] } 
            receiveShadow  
        />
        <ObstacleRigidBody
            obstacle = { obstacle }
        >
            <mesh 
                geometry = { boxGeometry }
                material = { obstacleMaterial }
                scale = { [ 1.5, 1.5, 0.3 ] }
                castShadow
                receiveShadow
            />
        </ObstacleRigidBody>
    </group>
}
export default BlockAxe