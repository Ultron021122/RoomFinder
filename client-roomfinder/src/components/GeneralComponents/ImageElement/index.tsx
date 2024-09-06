import Image from "next/image";

export default function ImageElement({
    icon,
    content,
    width,
    height,
    style
}: { icon: string, content: string, width:number, height:number, style:string}) {
    return (
        <div className={style}>
            <Image
                src={icon}
                alt=''
                width={width}
                height={height}
            />
            <p className="text-center text-lg">
                {content}
            </p>
        </div>
    );
}