import { Text, Float } from '@react-three/drei'
import { boxGeometry, floorMaterial1 } from './BlockSource'
import { isMobile } from 'react-device-detect'
import useGame from '../../stores/useGame'

function BlockStart( { position = [ 0, 0, 0 ] } ){

    const difficulty = useGame((state) => state.difficulty)

    let textConfig = {

        font : "./bebas-neue-v9-latin-regular.woff",
        scale : 0.5 ,
        maxWidth : 0.25 ,
        lineHeight : 0.75,
        textAlign : "right",
        position : [ 0.75, 0.65, 0 ] ,
        rotationY : - 0.25 
    }
    if( isMobile ){

        textConfig = {

            font : "./bebas-neue-v9-latin-regular.woff",
            scale : 0.5 ,
            maxWidth : 0.25 ,
            lineHeight : 0.75,
            textAlign : "right",
            position : [ 0, 0.65, -2 ] ,
            rotationY : - 0.25 
        }

    }

    return <group position = { position } >
        <Float
            floatIntensity = { 0.25 } 
            rotationIntensity = { 0.25 }
        >
            
            <Text {...textConfig}
            >
                { difficulty === 1 ?  "Marble Race" : `Level ${difficulty}` }

                <meshBasicMaterial toneMapped={ false } />
            </Text>
        </Float>
        <mesh 
            geometry = { boxGeometry } 
            material = { floorMaterial1 }
            position-y = { -0.1 } 
            scale = { [ 4, 0.2, 4 ] } 
            receiveShadow  
        />
    </group>
}

export default BlockStart