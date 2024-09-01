import Image from "next/image";

export default function Element({icon, content}:{icon:string, content:string}){
    return(
        <div className="
            flex flex-col 
            justify-center 
            items-center
            ">
            <Image
                src={icon}
                alt=''
                width={120}
                height={120}
            />
            <p className="mt-4 text-center text-lg">
                {content}
            </p>
        </div>
    );
}