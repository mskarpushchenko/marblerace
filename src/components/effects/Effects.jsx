import FailEffect from './FailEffect'
import { forwardRef } from 'react'

export default forwardRef(function(props, ref)
{
    const effect = new FailEffect(props)
    
    return <primitive ref={ ref } object={ effect }  dispose={null} />
})