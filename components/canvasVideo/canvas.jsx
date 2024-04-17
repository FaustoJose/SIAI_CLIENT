
"use client"
import React, { useRef, useEffect, useState } from 'react';

const VideoCanvas01 = ({Hablando,precentacion}) => {

const canvasRef = useRef(null);
const videoRef = useRef(null);

useEffect(() => {

  

  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');
  let animationFrameId;

  const draw = () => {
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    animationFrameId = requestAnimationFrame(draw);
  };

  const startDrawing = () => {
    if (videoRef.current && context ) {
      draw();
    }
  };

  startDrawing();

  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}, []); 

 
  
    return (

      
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <div style={{width: 0,height: 0, opacity: '0' }}>
        {precentacion ?(<video  ref={videoRef}  src="/video/Preguntame .mp4" width='0' height='0' autoPlay muted={true}  loop={precentacion} />):(<video  ref={videoRef}  src={Hablando?"/video/Hablado.mp4":"/video/tranquilo.mp4"} width='0' height='0' autoPlay muted={true}  loop={Hablando||!Hablando} />)}
        </div>
       
          <canvas 
            ref={canvasRef} 
            width='640' 
            height='360' 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
       
      </div>
    );
  };

export default VideoCanvas01;
