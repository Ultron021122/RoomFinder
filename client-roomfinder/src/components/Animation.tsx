import { Application } from '@splinetool/runtime';

const Animation = () => {
    const canvas = document.getElementById('animation')
    const app = new Application(canvas);
    app.load('https://prod.spline.design/9vjzETfyPXOQgXh7/scene.splinecode');
    
    return (
        <>
            <div id='animation'></div>
        </>
    );
}

export default Animation;


