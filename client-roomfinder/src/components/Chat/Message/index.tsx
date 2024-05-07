import Image from "next/image";

export default function Message() {
    return (
        <div className="">
            <div className="">
                <Image
                    src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                    alt="Picture of the author"
                    width={500}
                    height={500}
                />
                <p className="">Mensaje texto</p>
            </div>
            <div className="">Fecha de creación</div>
        </div>
    );
}