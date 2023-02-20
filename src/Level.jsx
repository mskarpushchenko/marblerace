import { useMemo} from 'react'
import useGame from './stores/useGame'

import Bounds from './components/Bounds'

import BlockStart from './components/blocks/BlockStart'
import BlockSpinner from './components/blocks/BlockSpinner'
import DoubleBlockSpinner from './components/blocks/BlockDoubleSpinner'
import BlockLimbo from './components/blocks/BlockLimbo'
import BlockAxe from './components/blocks/BlockAxe'
import BlockEnd from './components/blocks/BlockEnd'
import BlockSinus from './components/blocks/BlockSinus'

// BlockSpinner, DoubleBlockSpinner, BlockLimbo, BlockAxe
export function Level({ count = 4, types = [ BlockSpinner, DoubleBlockSpinner, BlockLimbo, BlockAxe ], seed = 0 }){

    const difficulty = useGame( (state) => state.difficulty )
    const newCount = difficulty + count
    const blocks = useMemo(() =>{
        const blocks = []
        // return [...Array(count)].map(() =>  types[Math.floor(Math.random() * types.length)]
        for(let i = 0; i < newCount; i++)
        {
            const type = types[ Math.floor(Math.random() * types.length) ]
            blocks.push(type)
        }
        return blocks
        
    },[ count, types.length, seed])

    



    return <>    
        <BlockStart position={ [ 0, 0, 0 ] }/>
        { blocks.map((Block, index) => <Block key = { index } position = { [ 0, 0, -(index + 1) * 4 ] } />) }
        <BlockEnd position={ [ 0, 0, -( newCount + 1 ) * 4 ] } />
        <Bounds length = {newCount + 2} />
    </>
}


