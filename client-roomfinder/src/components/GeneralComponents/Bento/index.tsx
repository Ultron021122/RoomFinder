import {
    BellIcon,
    CalendarIcon,
    ChatBubbleIcon,
    FileTextIcon,
    GlobeIcon,
    InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

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
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
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
