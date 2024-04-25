import React from "react";

export const FolderIcon = ({
    fill = 'currentColor',
    filled,
    size,
    height,
    width,
    label,
    ...props
}: {
    fill?: string;
    filled?: boolean;
    size?: number;
    height?: number;
    width?: number;
    label?: string;
    props?: any;
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={fill}
            width={size || width || 20}
            height={size || height || 20}
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
            />
        </svg>
    );
};

export const UploadIcon = ({
    fill = 'currentColor',
    filled,
    size,
    height,
    width,
    label,
    ...props
}: {
    fill?: string;
    filled?: boolean;
    size?: number;
    height?: number;
    width?: number;
    label?: string;
    props?: any;
}) => {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={fill}
                width={size || width || 20}
                height={size || height || 20}
                {...props}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
        </>
    );
};
