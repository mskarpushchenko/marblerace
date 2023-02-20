import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
export default create(subscribeWithSelector(( set ) =>
{
    return {
        difficulty: 1,
        blocksCount: 4,
        blocksSeed: 0,
        startTime: 0,
        endTime: 0,
        phase:'ready',
        start: () =>
        {
            set((state) => { 

                if(state.phase === 'ready'){

                    return { phase: 'playing', startTime : Date.now() }
                }

                return {}
             })
            
        }
        ,
        restart: () =>
        {
            set((state) => {

                const hhh = { phase: 'ready', blocksSeed: Math.random() }

                if( state.phase === 'ended'){

                    return { ...hhh, difficulty: state.difficulty + 1 }
                }

                if(state.phase === 'playing' || state.phase === 'loose'){

                    return hhh
                }

                return {}
            })
            
        }
        ,
        end: () =>
        {
            set((state) => {

                if(state.phase === 'playing'){

                    return { phase: 'ended', endTime: Date.now() }
                }
                
                return {}
             })
            
        },
        loose: () =>
        {
            set((state) => {

                if(state.phase === 'playing'){

                    return { phase: 'loose', endTime : Date.now()}
                }
                
                return {}
             })
            
        }

    }

}))