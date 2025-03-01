import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, user, Spinner } from "@nextui-org/react";
import { useDropzone } from 'react-dropzone';
import { useEffect, useState } from 'react';
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import { UserProfile } from "@/utils/interfaces";
import { toast, Bounce, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageIcon } from "lucide-react";
import { COVER_IMAGE, PROFILE_IMAGE } from "@/utils/constants";

interface ImageModalComponentProps {
    isOpen: boolean;
    onClose: () => void;
    imageType?: number | null
}

const ImageModal: React.FC<ImageModalComponentProps> = ({ isOpen, onClose, imageType }) => {
    const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
    const { data: session, update } = useSession();
    const user = session?.user as UserProfile;

    const [isLoading, setIsLoading] = useState(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);

    //Errores
    useEffect(() => {
        if (errorSystem) {
            toast.error(errorSystem, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
    }, [errorSystem]);

    // Handler for image drop and selection
    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Use Dropzone
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png'] }
    });

    const handleImageUpload = async () => {
        // Upload image to server
        if (selectedImage) {
            // Upload logic here
            setIsLoading(true);
            setErrorSystem(null);

            try {
                // Upload image
                const response = await axios.patch("/api/users/upload", {
                    usuarioid: user.usuarioid,
                    image: selectedImage,
                    type: imageType
                }, {
                    headers: {
                        'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                    }
                });

                setIsLoading(false);
                if (response.status === 200) {
                    console.log(response)
                    const { vchimage, vchcoverimage } = response.data.message.data;
                    await update({
                        ...session,
                        user: {
                            ...session?.user,
                            vchimage: vchimage,
                            vchcoverimage: vchcoverimage
                        }
                    });
                    toast.success(response.data.message.message, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Bounce,
                    });
                } else {
                    setErrorSystem(response.data.message);
                }
                onClose();
            } catch (Error: any) {
                // Handle error
                setErrorSystem(Error.response?.data.message);
            } finally {
                setIsLoading(false);
            }
        } else {
            // No image selected
            setErrorSystem("No image selected");
        }
        // Close modal
        onClose();
    }

    useEffect(() => {
        if (!isOpen) {
            setSelectedImage(null);
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onClose}
            scrollBehavior="inside"
            placement="top-center"
            className="dark:bg-gray-900"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 font-semibold text-neutral-900 dark:text-neutral-100">{imageType === COVER_IMAGE ? "Imagen de fondo" : imageType === PROFILE_IMAGE && "Imagen de perfil"}</ModalHeader>
                {
                    isLoading ? (
                        <div className="flex items-center justify-center h-80">
                            <Spinner color="primary" />
                        </div>
                    ) : (
                        <>
                            <ModalBody>
                                <div
                                    {...getRootProps({ className: 'dropzone' })}
                                    className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer"
                                >
                                    <input {...getInputProps()} />
                                    {selectedImage ? (
                                        <div className="mt-4">
                                            <Image
                                                width={300}
                                                height={300}
                                                src={selectedImage as string}
                                                alt="Selected"
                                                className="w-full max-h-96 rounded-md"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center flex flex-col items-center justify-center">
                                            <ImageIcon size={48} className="text-gray-600 dark:text-gray-200" />
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-200">
                                                <span className="text-gray-600 dark:text-gray-200">Sube una imagen</span>
                                                <p className="pl-1">o arrastra y suelta</p>
                                            </div>
                                            <p className="text-xs leading-5 text-blue-400">PNG, JPG, GIF hasta 10MB</p>
                                        </div>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cerrar
                                </Button>
                                <Button color="primary" onPress={handleImageUpload}>
                                    Guardar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
            </ModalContent>
        </Modal >
    );
};

export default ImageModal;
