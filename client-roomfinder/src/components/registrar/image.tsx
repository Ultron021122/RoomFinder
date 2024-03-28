"use client";

import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import React, { useEffect, useRef, useState } from 'react';
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

export default function ModalImage({ onImageSave }: { onImageSave: (image: string | null) => void }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const fileSize = file.size / 1024 / 1024; // in MB
            if (fileSize > 2) {
                setErrorMessage('El tamaño de la imagen no debe ser mayor a 2MB.');
            } else {
                setErrorMessage(null);
                setSelectedFile(e.target.files[0]);
                onOpen();
            }
        }
        e.target.value = '';
    };

    const handleSave = (canvas: HTMLCanvasElement) => {
        if (canvas) {
            const dataUrl = canvas.toDataURL();
            setCroppedImageUrl(dataUrl);
            onOpenChange();
            onImageSave(dataUrl);
        } else {
            onImageSave(null);
        }
    };

    const ImageProfile = ({
        selectedFile,
        onCropComplete,
    }: {
        selectedFile: File | null,
        onCropComplete: (canvas: HTMLCanvasElement) => void;
    }) => {
        const [upImg, setUpImg] = useState<string | undefined>();

        const imgRef = useRef<HTMLImageElement | null>(null);
        const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

        const [crop, setCrop] = useState<Crop | undefined>(undefined);
        const [completeCrop, setCompleteCrop] = useState<Crop | null>(null);

        const [hasUserMadeCrop, setHasUserMadeCrop] = useState(false);

        const min = 100;
        const max = 600;

        useEffect(() => {
            if (selectedFile) {
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
                    const img = new Image();
                    img.src = reader.result as string;
                });
                reader.readAsDataURL(selectedFile);
            }
        }, [selectedFile]);

        const onLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
            // Set image reference to image element
            imgRef.current = event.currentTarget;
        };

        useEffect(() => {
            if (completeCrop) {
                const canvas = document.createElement('canvas');
                setCanvasImage(imgRef.current!, previewCanvasRef.current!, completeCrop);
            }
        }, [completeCrop]);

        return (
            <div>
                <div className='flex items-center justify-center w-full bg-transparent'>
                    <ReactCrop
                        className='w-auto h-auto'
                        circularCrop
                        ruleOfThirds
                        crop={crop}
                        minWidth={min}
                        maxWidth={max}
                        keepSelection={true}
                        onChange={(c) => { setCrop(c); setHasUserMadeCrop(true); }}
                        onComplete={(c) => setCompleteCrop(c)}
                        aspect={1}
                    >
                        {upImg && <img src={upImg} alt='Crop' onLoad={onLoad} />}
                    </ReactCrop>
                </div>
                {/* Canvas to display cropped image */}
                <canvas
                    ref={previewCanvasRef}
                    // Roundind is important so the canvas width and height are matches/is a multiple for sharpness.
                    style={{
                        width: Math.round(completeCrop?.width ?? 0),
                        height: Math.round(completeCrop?.height ?? 0),
                    }}
                    className='hidden'
                />
                <Button
                    fullWidth
                    color='success'
                    variant='solid'
                    radius='sm'
                    className='mt-5 dark:text-gray-50'
                    onPress={() => onCropComplete(previewCanvasRef.current!)}
                    isDisabled={!hasUserMadeCrop}
                >
                    Establecer imagen de pérfil
                </Button>
            </div>
        );
    }
    return (
        <>
            <div className='flex items-center justify-center w-full rounded-md'>
                <label htmlFor='dropzone-file' className='flex flex-col items-center justify-center my-2 w-40 h-40 sm:w-56 sm:h-56 ring-4 ring-offset-gray-50 dark:ring-offset-gray-900 ring-offset-4 ring-blue-500 rounded-full cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'>
                    {croppedImageUrl ? (
                        <div>
                            <img
                                src={croppedImageUrl}
                                alt='Profile Picture'
                                className='rounded-full object-cover w-40 h-40 sm:w-56 sm:h-56'
                            />
                        </div>
                    ) : (
                        <>
                            <svg className="w-16 h-16 sm:w-24 sm:h-24 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                        </>
                    )}
                    <input id='dropzone-file' type='file' accept='image/*' className='hidden' onChange={onSelectFile} />
                </label>
            </div>
            {errorMessage && <p className='text-center text-sm text-red-500 dark:text-red-400'>{errorMessage}</p>}
            <Modal
                isOpen={isOpen}
                placement='bottom'
                scrollBehavior='inside'
                onOpenChange={onOpenChange}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                radius='sm'
                classNames={{
                    header: 'bg-white dark:bg-gray-800 dark:text-gray-100 border-b dark:border-gray-600',
                    body: 'bg-white dark:bg-gray-800 h-96',
                    footer: 'bg-white dark:bg-gray-800 border-t dark:border-gray-600'
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Imagen de pérfil</ModalHeader>
                            <ModalBody>
                                <ImageProfile selectedFile={selectedFile} onCropComplete={handleSave} />
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}