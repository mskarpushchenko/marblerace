
import { Physics, Debug, RigidBody } from '@react-three/rapier'
import Lights from './Lights.jsx'
import { Level } from './Level.jsx'
import Player from './Player.jsx'
import useGame from './stores/useGame.jsx'
import Effects from './components/effects/Effects.jsx'
import { Perf } from 'r3f-perf'
import { useRef, Suspense } from 'react'
import { BlendFunction } from 'postprocessing'
import {EffectComposer } from '@react-three/postprocessing'

export default function Experience()
{ 
    const blocksCount = useGame( (state) => state.blocksCount )
    const blocksSeed= useGame((state) => state.blocksSeed)

    const phase = useGame((state) => state.phase)

    const failRef = useRef()

    return <>
            <Suspense fallback = { <div className="beready">I'm ready for the most incredibile experience in my whole life!</div> } >
                <EffectComposer enabled = { phase === 'loose'} >
                    <Effects ref = { failRef } blendFunction = { BlendFunction.DARKEN } />
                </EffectComposer>
            </Suspense>
            <Perf position = "top-left" />
            <color args = { [ '#252731' ] } attach = "background" />
            <Physics>
                <Lights />
                <Level 
                    count = { blocksCount }
                    seed = { blocksSeed } />
                <Player />
            </Physics>
    </>
}