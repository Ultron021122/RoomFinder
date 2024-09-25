// components/TextFader.js
import { useEffect, useState } from 'react';

const TextFader = ({ description, limit }: { description: string, limit: number }) => {
    const [isFaded, setIsFaded] = useState(false);

    useEffect(() => {
        setIsFaded(description.length > limit);
    }, [description, limit]);

    return (
        <p className={`mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:row-start-4 lg:col-span-1 dark:text-slate-400 ${isFaded ? 'faded' : 'normal'}`}>
            {description}
        </p>
    );
};

export default TextFader;
