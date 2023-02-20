import { RigidBody } from '@react-three/rapier'
import { useState } from 'react'
import useGame from '../../stores/useGame'

const ObstacleRigidBody = ( {obstacle, positionX = 0, positionY = 0, children} ) => {

    const loose = useGame(( state ) => state.loose ) 
    const [ hitSound ] = useState(() => new Audio('./hit.mp3'))

    const onCollisionEnter = () =>{

        hitSound.currentTime = 0
        hitSound.volume = Math.random()
        hitSound.play()

        loose();
    }

    return  <RigidBody
                ref = { obstacle }
                type = "kinematicPosition"
                position-x = { positionX }
                position-y = { positionY }
                restitution = { 0.2 } 
                friction = { 0 }
                onCollisionEnter={ onCollisionEnter }
            >
                { children }
    </RigidBody>
}
export default ObstacleRigidBody