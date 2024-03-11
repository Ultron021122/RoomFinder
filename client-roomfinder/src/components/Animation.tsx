'use client';
import { Application } from '@splinetool/runtime';
import { useEffect, useRef } from 'react';

const Animation = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const app = new Application(canvas);
            app.load('https://prod.spline.design/9vjzETfyPXOQgXh7/scene.splinecode');
        }
    }, []);

    return (
        <canvas id='animation' ref={canvasRef}>
        </canvas>
    );
}

export default Animation;


