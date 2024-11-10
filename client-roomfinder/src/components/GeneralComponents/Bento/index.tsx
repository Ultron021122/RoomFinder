import {
    BellIcon,
    CalendarIcon,
    ChatBubbleIcon,
    FileTextIcon,
    GlobeIcon,
    InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { AnimatedList } from "@/components/ui/animated-list";
import { cn } from "@/lib/utils";

interface Item {
    name: string;
    description: string;
    icon: string;
    color: string;
    time: string;
}

let notifications = [
    {
        name: "Payment received",
        description: "Magic UI",
        time: "15m ago",

        icon: "💸",
        color: "#00C9A7",
    },
    {
        name: "User signed up",
        description: "Magic UI",
        time: "10m ago",
        icon: "👤",
        color: "#FFB800",
    },
    {
        name: "New message",
        description: "Magic UI",
        time: "5m ago",
        icon: "💬",
        color: "#FF3D71",
    },
    {
        name: "New event",
        description: "Magic UI",
        time: "2m ago",
        icon: "🗞️",
        color: "#1E86FF",
    },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: Item) => {
    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
                // animation styles
                "transition-all duration-200 ease-in-out hover:scale-[103%]",
                // light styles
                "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                // dark styles
                "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <div
                    className="flex size-10 items-center justify-center rounded-2xl"
                    style={{
                        backgroundColor: color,
                    }}
                >
                    <span className="text-lg">{icon}</span>
                </div>
                <div className="flex flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
                        <span className="text-sm sm:text-lg">{name}</span>
                        <span className="mx-1">·</span>
                        <span className="text-xs text-gray-500">{time}</span>
                    </figcaption>
                    <p className="text-sm font-normal dark:text-white/60">
                        {description}
                    </p>
                </div>
            </div>
        </figure>
    );
};

const features = [
    {
        Icon: ChatBubbleIcon,
        name: "Comunicate con tus inquilinos",
        description: "Nosotros nos encargamos de la comunicación con tus inquilinos.",
        href: "/",
        cta: "Aprende más",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
        Icon: InputIcon,
        name: "Buscador",
        description: "Busca tus inmuebles por nombre, dirección o código postal.",
        href: "/",
        cta: "Aprende más",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
        Icon: GlobeIcon,
        name: "Multilingual",
        description: "Supports 100+ languages and counting.",
        href: "/",
        cta: "Aprende más",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
        Icon: CalendarIcon,
        name: "Calendario",
        description: "Usa el calendario para ver la disponibilidad de tus inmuebles.",
        href: "/",
        cta: "Aprende más",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
        Icon: BellIcon,
        name: "Notificaciones",
        description:
            "Recibe notificaciones en tiempo real de tus inquilinos.",
        href: "/",
        cta: "Aprende más",
        background:
            <AnimatedList className="absolute right-2 top-4 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
                {notifications.map((item, index) => (
                    <Notification key={index} {...item} />
                ))}
            </AnimatedList>
        ,
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
];

// BentoGrid is a grid layout component that arranges its children in a grid.
// It uses CSS Grid to create the layout.
// Should be used with BentoCard components as children altthough it's from the side server.
export function Bento() {
    return (
        <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
                <BentoCard key={feature.name} {...feature} />
            ))}
        </BentoGrid>
    );
}
