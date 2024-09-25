import { Textarea } from "@nextui-org/react";

export default function Commentary() {
    return (
        <Textarea
            label="Description"
            placeholder="Enter your description"
            className="max-w-xs"
        />
    );
}