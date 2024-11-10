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
                         <Image
                             width={160}
                             height={160}
                             priority
                             src='/perfiles/default-image.png'
                             alt='Profile Picture'
                             className='rounded-full opacity-50 object-center object-cover w-40 h-40 sm:w-48 sm:h-48'
                         />
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
