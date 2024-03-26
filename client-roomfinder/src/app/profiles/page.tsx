"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";

function setCanvasImage(image: HTMLImageElement, canvas: HTMLCanvasElement, crop: Crop) {
    if (!crop || !canvas || !image) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    const pixelRatio = window.devicePixelRatio;
    // Set canvas width and height
    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx!.imageSmoothingQuality = 'high';

    ctx!.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
    );
}

export default function ImageProfile() {
    const [upImg, setUpImg] = useState<string | undefined>();

    const imgRef = useRef<HTMLImageElement | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const [crop, setCrop] = useState<Crop | undefined>(undefined);
    const [completeCrop, setCompleteCrop] = useState<Crop | null>(null);

    const min = 100;
    const max = 600;

    // On selecting file we set load the image on to cropper
    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setUpImg(reader.result as string);
                setCrop({
                    unit: "px",
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                });
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        // Set image reference to image element
        imgRef.current = event.currentTarget;
    };

    useEffect(() => {
        if (completeCrop) {
            setCanvasImage(imgRef.current!, previewCanvasRef.current!, completeCrop);
        }
    }, [completeCrop]);

    return (
        <div>
            <div>
                <input type='file' accept='image/*' onChange={onSelectFile} />
            </div>
            <div className='bg-gray-200'>
                <ReactCrop
                    className='w-[600px]'
                    ruleOfThirds
                    crop={crop}
                    minWidth={min}
                    maxWidth={max}
                    keepSelection={true}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompleteCrop(c)}
                    aspect={1}
                >
                    {upImg && <img src={upImg} alt='Crop' onLoad={onLoad} />}
                </ReactCrop>
            </div>
            <div>
                {/* Canvas to display cropped image */}
                <canvas
                    ref={previewCanvasRef}
                    // Roundind is important so the canvas width and height are matches/is a multiple for sharpness.
                    style={{
                        width: Math.round(completeCrop?.width ?? 0),
                        height: Math.round(completeCrop?.height ?? 0),
                    }}
                />
            </div>
        </div>
    );
}