'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface CopyTextProps {
    text: string;
    maxLength?: number;
}

const CopyText: React.FC<CopyTextProps> = ({ text, maxLength }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
        } catch (error) {
            console.error('Failed to copy text: ', error);
        }
    };

    return (
        <div className="relative p-4 group">
            <p className="text-gray-800 dark:text-gray-200">{text}</p>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-auto bg-gray-200 dark:bg-gray-700/50"
                            variant="copyText"
                        >
                            {copied ? <Check/> : <Copy/>}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="w-auto">
                        <p>Copiar</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default CopyText;