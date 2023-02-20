import { BlendFunction, Effect } from 'postprocessing'

const fragmentShader = /* glsl */`

  
    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    {
        outputColor = vec4(0.8, 0.0, 0.0, inputColor.a);
    }
`

export default class FailEffect extends Effect
{
    constructor({ blendFunction = BlendFunction.DARKEN })
    {
        super(
            'FailEffect',
            fragmentShader,
            {
                blendFunction
            }
        )
    }
}