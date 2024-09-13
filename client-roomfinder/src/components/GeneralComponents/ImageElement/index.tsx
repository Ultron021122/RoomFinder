import Image from "next/image";

export default function ImageElement({
    icon,
    content,
    width,
    height,
    style,
    onClick
}: { icon: string, content: string, width:number, height:number, style:string, onClick?: any}) {
    return (
        <div className={style} onClick={onClick}>
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