import { useEffect, useRef } from 'react';
const canvasSketch = require('canvas-sketch');

export default function Mandalorian(){
    const canvasRef = useRef(null);
    useEffect(()=>{

        const settings = {
            animate:true,
            duration:10,
            fps:60,
            dimensions: [1080 , 1920],
            canvas: canvasRef.current
          };
          
          // Artwork function
          const sketch = ({width , height}:any) => {
            let rows = 50 ;
            let cols = 100;
            let size = width / cols;
            return ({ context, width, height , playhead}:any) => {

                context.clearRect(0 ,0, width , height);
                context.fillStyle='black';
                context.fillRect(0,0,width , height);
                context.fillStyle = 'white';
                for(let i = 0 ;i<cols ; i++){
                    for(let j = 0 ; j< rows ; j++){
                        context.save();
                        context.translate(i * size , j * size );
                        context.fillRect(0,0 , size * Math.random(), size  * Math.random() );
                        context.restore();
                    }
                }
            };
          };
          
          // Start the sketch
          canvasSketch(sketch, settings);
    },[])
    return (<canvas ref={canvasRef} style={{width:'100%'}}></canvas>)
}