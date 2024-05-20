"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import React, { useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";
import Image from 'next/image';

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
    ctx!.imageSmoothingQuality = 'medium';

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
            const dataUrl = canvas.toDataURL('image/jpeg');
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
                    const img = new window.Image();
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
                        {upImg && <Image width={40} height={40} src={upImg} alt='Profile Picture' className="w-auto h-auto" onLoad={onLoad} />}
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
                {/* Botón para establecer imagen de perfil */}
                <Button
                    fullWidth
                    color='success'
                    variant='solid'
                    radius='sm'
                    className='my-3 text-gray-100 hover:text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'

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
            {/* Campo para seleccionar la imagen */}
            <div className='flex flex-col items-center justify-center w-full rounded-md'>
                <label htmlFor='dropzone-file' className='flex flex-col items-center justify-center my-2 w-40 h-40 sm:w-48 sm:h-48 ring-4 ring-offset-gray-50 dark:ring-offset-gray-900 ring-offset-4 hover:ring-blue-500 rounded-full cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'>
                    {croppedImageUrl ? (
                        <Image
                            width={160}
                            height={160}
                            src={croppedImageUrl}
                            alt='Profile Picture'
                            className='rounded-full object-cover w-40 h-40 sm:w-48 sm:h-48'
                        />
                    ) : (
                        // <Image
                        //     width={160}
                        //     height={160}
                        //     priority
                        //     src='/perfiles/astronauta.jpg'
                        //     alt='Profile Picture'
                        //     className='rounded-full opacity-50 object-center object-cover w-40 h-40 sm:w-48 sm:h-48'
                        // />
                        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 341.000000 333.000000"
                            className="rounded-full object-cover w-40 h-40 sm:w-48 sm:h-48"
                            preserveAspectRatio="xMidYMid meet"
                            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <g transform="translate(0.000000,333.000000) scale(0.100000,-0.100000)"
                                fill="currentColor" stroke="currentColor">
                                <path d="M1584 3162 c-16 -16 -157 -152 -314 -303 -157 -151 -503 -483 -768
-738 -309 -296 -482 -470 -480 -480 3 -14 35 -16 281 -19 l277 -2 0 -590 0
-590 978 2 977 3 3 588 2 587 269 0 c225 0 271 2 281 15 13 16 10 19 -372 418
l-168 174 0 246 c0 199 -3 246 -14 250 -32 13 -36 -15 -36 -264 l0 -246 260
-271 261 -272 -263 -2 -263 -3 -5 -590 -5 -590 -927 -3 -928 -2 0 582 c0 321
-4 589 -8 595 -6 9 -74 13 -261 15 l-254 3 513 495 c892 860 995 960 1000 959
3 -1 113 -115 245 -254 132 -140 247 -254 256 -254 26 -1 29 19 29 170 l0 139
184 0 c192 0 216 3 216 26 0 22 -33 25 -245 22 l-200 -3 -5 -139 -5 -138 -234
246 c-128 135 -237 246 -241 246 -4 0 -21 -13 -36 -28z"/>
                                <path d="M1780 2171 c-87 -28 -158 -90 -201 -173 -32 -61 -38 -186 -13 -265
25 -81 117 -174 194 -197 215 -64 414 70 428 288 9 139 -52 255 -167 319 -46
26 -67 31 -135 34 -45 1 -92 -1 -106 -6z m191 -167 c43 -40 59 -82 59 -156 0
-105 -55 -175 -143 -185 -65 -8 -126 23 -157 80 -35 62 -34 156 3 219 34 59
75 80 150 75 47 -3 63 -9 88 -33z"/>
                                <path d="M950 1851 l0 -321 75 0 74 0 3 123 3 122 94 -122 94 -123 94 0 94 0
-111 132 -110 132 27 14 c44 23 64 44 84 87 40 87 13 192 -62 242 -41 27 -47
28 -201 31 l-158 4 0 -321z m257 184 c25 -18 34 -59 21 -97 -13 -35 -35 -48
-87 -48 l-41 0 0 80 0 80 43 0 c23 0 52 -7 64 -15z"/>
                                <path d="M1132 1434 c-60 -22 -146 -104 -179 -172 -24 -49 -28 -69 -28 -142 0
-71 4 -94 26 -141 55 -117 148 -179 279 -187 97 -5 170 21 235 84 70 68 100
140 100 244 0 71 -5 94 -27 141 -30 66 -89 129 -150 160 -56 29 -192 36 -256
13z m199 -147 c101 -67 105 -259 6 -331 -42 -31 -140 -29 -185 2 -49 35 -66
76 -67 157 0 83 24 138 75 173 46 31 124 30 171 -1z"/>
                                <path d="M1720 1426 c0 -8 -11 -139 -25 -292 -14 -152 -25 -290 -25 -306 l0
-28 69 0 70 0 5 53 c3 28 11 113 17 187 6 74 12 136 13 137 1 1 31 -82 67
-185 l65 -187 44 0 44 0 66 187 c35 102 66 186 67 184 1 -1 7 -62 13 -136 5
-74 13 -159 16 -187 l5 -53 73 0 72 0 -28 298 c-15 163 -27 307 -28 320 0 21
-4 22 -79 22 l-79 0 -36 -92 c-19 -51 -51 -133 -69 -182 -19 -48 -37 -84 -40
-78 -4 5 -33 79 -66 163 -32 85 -62 162 -66 172 -6 14 -20 17 -86 17 -62 0
-79 -3 -79 -14z"/>
                                <path d="M1415 205 l0 -135 33 0 32 0 0 55 0 55 46 0 c44 0 45 1 42 28 -3 24
-7 27 -45 30 -34 3 -43 7 -43 22 0 15 9 19 48 22 43 3 47 5 50 31 l3 27 -83 0
-83 0 0 -135z"/>
                                <path d="M1600 205 l0 -135 35 0 35 0 0 135 0 135 -35 0 -35 0 0 -135z" />
                                <path d="M1700 205 l0 -135 35 0 34 0 3 77 3 78 48 -78 c45 -72 51 -77 83 -77
l34 0 0 135 0 135 -35 0 -35 0 0 -77 0 -78 -51 78 c-46 72 -52 77 -84 77 l-35
0 0 -135z"/>
                                <path d="M1970 205 l0 -135 60 0 c36 0 74 7 91 15 62 32 87 121 54 186 -25 47
-70 69 -142 69 l-63 0 0 -135z m130 55 c40 -40 12 -130 -40 -130 -18 0 -20 7
-20 75 0 68 2 75 20 75 11 0 29 -9 40 -20z"/>
                                <path d="M2214 205 l1 -135 78 0 77 0 0 30 c0 29 -2 30 -45 30 -41 0 -45 2
-45 25 0 23 4 25 46 25 44 0 45 1 42 28 -2 15 -9 28 -15 28 -7 1 -26 2 -43 3
-23 1 -30 6 -30 21 0 17 7 20 45 20 43 0 45 1 45 30 l0 30 -78 0 -78 0 0 -135z"/>
                                <path d="M2404 205 l0 -135 33 0 33 0 0 51 0 51 40 -51 c37 -46 44 -51 81 -51
l41 0 -45 54 -46 53 24 23 c33 31 34 90 3 120 -18 16 -35 20 -93 20 l-71 0 0
-135z m114 56 c4 -23 -11 -41 -35 -41 -8 0 -13 14 -13 36 0 31 3 35 23 32 14
-2 23 -11 25 -27z"/>
                            </g>
                        </svg>
                    )}
                    <input id='dropzone-file' type='file' accept='image/*' className='hidden' onChange={onSelectFile} />
                </label>
                {croppedImageUrl ? (
                    <p className='text-tiny text-blue-500 dark:text-blue-400 mt-2'>Imagen establecida correctamente</p>
                ) : (
                    <p className='text-tiny text-gray-500 dark:text-gray-400 mt-2'>Imagen aún no establecida</p>
                )}
            </div>
            {/* Peso de imagen excedido 2MB */}
            {errorMessage && <p className='text-center text-sm text-red-500 dark:text-red-400'>{errorMessage}</p>}
            {/* Modal */}
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
                    footer: 'bg-white dark:bg-gray-800 border-t dark:border-gray-600 justify-center'
                }}
            >
                <ModalContent>
                    <>
                        <ModalHeader>Imagen de pérfil</ModalHeader>
                        <ModalBody>
                            <ImageProfile selectedFile={selectedFile} onCropComplete={handleSave} />
                        </ModalBody>
                        <ModalFooter>
                            <p className='text-tiny text-gray-600 dark:text-gray-300'>Selecciona la imagen que deseas establecer como tu foto de perfil.</p>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </>
    );
}
