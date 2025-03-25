import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Expand, Fullscreen, X } from 'lucide-react'

interface ImageOverlayProps {
    images: { url: string; photoid: number }[]
}

export function ImageOverlay({ images }: ImageOverlayProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="absolute top-2 right-2 z-30">
                    <Expand size={25} className='text-gray-700' />
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:p-0 max-w-max max-h-[90vh] p-2 text-white"
                aria-label="Image overlay"
            >
                <div className="relative w-full h-full">
                    <Image
                        src={images[currentIndex].url || "/placeholder.svg"}
                        alt={`Property image ${currentIndex + 1}`}
                        width={800}
                        height={600}
                        className="object-cover rounded-lg"
                    />
                    <Button
                        variant="ghost"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2"
                        onClick={prevImage}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={nextImage}
                    >
                        <ChevronRight className="h-8 w-8" />
                    </Button>
                    <div className="absolute text-xs bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

