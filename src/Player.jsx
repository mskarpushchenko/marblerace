import * as THREE from 'three'
import { RigidBody } from "@react-three/rapier"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { useState, useEffect, useRef } from "react"
import { useRapier } from "@react-three/rapier"
import useGame from './stores/useGame'
import { isMobile } from 'react-device-detect'


 
export default function Player(){

const body = useRef()
const [ subscribeKeys, getKeys ] = useKeyboardControls()
const { rapier, world } = useRapier()
const rapierWorld = world.raw()
const [ smoothCameraPosition ] = useState(() => new THREE.Vector3(10, 10, 10))
const [ smoothCameraTarget ] = useState (()=> new THREE.Vector3())
const start = useGame((state) => state.start)
const end = useGame((state) => state.end)
const blocksCount = useGame((state) => state.blocksCount)
const restart = useGame((state) => state.restart)
const jumpCount = useRef(0)
const isJumping = useRef(false)
const tiltRight = useRef(false)
const tiltLeft = useRef(false)
const tiltForward = useRef(false)
const tiltBackward = useRef(false)
const DoubleClick = useRef(false)



const getHit = () =>  {
    const origin = body.current.translation()
    origin.y -= 0.31
    const direction = { x: 0, y: -1, z: 0 } 
    const ray = new rapier.Ray(origin, direction)
    return rapierWorld.castRay(ray, 10, true)
}

if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function (eventData) {


        var tiltX = Math.round(eventData.gamma * 0.03);


        var tiltY =  Math.round(eventData.beta * 0.03);

        
        deviceOrientationHandler(tiltX, tiltY);

    }, false);
}
if( isMobile ){
window.addEventListener('dblclick', (event)=>{

    jump()

})
}



function deviceOrientationHandler(tiltX, tiltY){

    tiltRight.current = tiltX > 0 ? true : false
    tiltLeft.current = tiltX < 0 ? true : false
    tiltForward.current = tiltY < 0 ? true : false
    tiltBackward.current = tiltY > 0 ? true : false
 
}

const jump = () => {
    
    const hit = getHit();

    if(hit.toi < 0.15 || jumpCount.current < 2 ){ 
        
          body.current.applyImpulse({x:0, y:0.5, z:0})
          isJumping.current = true
          jumpCount.current++

          window.setTimeout(() =>
          {
              isJumping.current = false
          }, 200)
      }
}

const reset = () =>
{
    body.current.setTranslation( { x: 0, y: 1, z: 0 } )
    body.current.setLinvel( { x: 0, y: 1, z: 0 } ) 
    body.current.setAngvel( { x: 0, y: 1, z: 0 } )
}


useEffect(()=>{

    const unsubscribeReset = useGame.subscribe(

        (state) => state.phase,
        (value) => {
            if( value === 'ready' ){

                reset ()
            }
        }
    )

    const unsubscribeJump = subscribeKeys(
        (state) => {

            return state.jump
        },
        (value) => {
            if(value){

                jump()
            }
        }
    )
    const unsubscribeKeys = subscribeKeys(

        () =>{

            start()
        }
    )
    return () =>
    {
        unsubscribeJump()
        unsubscribeKeys()
        unsubscribeReset()
    }
}, [])

useFrame((state, delta) =>
{
    const {forward, backward, leftward, rightward} = getKeys()
    const impulse = {x: 0, y: 0, z: 0}
    const torque = {x: 0, y: 0, z: 0}
    const impulseStrength = 0.6 * delta
    const torqueStrength = 0.2 * delta

    if(forward || tiltForward.current)
    {
        impulse.z -= impulseStrength
        torque.x -= torqueStrength
    }
    if(backward || tiltBackward.current)
    {
        impulse.z += impulseStrength
        torque.x += torqueStrength
    }
    if(leftward || tiltLeft.current)
    {
        impulse.x -= impulseStrength
        torque.z += torqueStrength
    }
    if(rightward || tiltRight.current)
    {
        impulse.x += impulseStrength
        torque.z -= torqueStrength
    }

    body.current.applyImpulse(impulse)
    body.current.applyTorqueImpulse(torque)


    const bodyPosition = body.current.translation()

    const cameraPosition = new THREE.Vector3()
    cameraPosition.copy( bodyPosition )
    cameraPosition.z += 2.25
    cameraPosition.y += 0.65

    const cameraTarget = new THREE.Vector3()
    cameraTarget.copy( bodyPosition )
    cameraTarget.y += 0.25

    smoothCameraPosition.lerp( cameraPosition, 5 * delta )
    smoothCameraTarget.lerp( cameraTarget, 5 * delta )

    state.camera.position.copy( smoothCameraPosition )
    state.camera.lookAt( smoothCameraTarget )

    // phases
    if( bodyPosition.z < - ( blocksCount * 4 + 2 ) )
    
        end()

    if( bodyPosition.y < - 4 )

        restart()

    if( jumpCount.current >= 1  && !isJumping.current ){
    
        const hit = getHit();

        if( hit.toi < 0.15 ){

            jumpCount.current = 0
        }
    }
})

    return <RigidBody 
                ref={ body }
                position = { [ 0, 1, 0 ] }
                colliders = "ball"
                restitution = { 0.2 }
                friction = { 1 }
                linearDamping = { 0.5 }
                angularDamping = { 0.5 }
          
    >
        <mesh castShadow>
            <icosahedronGeometry args = { [ 0.3, 1 ] } />
            <meshStandardMaterial color = "mediumpurple" flatShading />
           
        </mesh>

    </RigidBody>
    
}