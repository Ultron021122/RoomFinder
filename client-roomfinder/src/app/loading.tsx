import { Spinner } from "@nextui-org/react";

export default function Loading() {
    // Define the Loading UI here
    return <div className="h-screen flex items-center justify-center mx-auto max-w-4xl">
        <Spinner color="secondary" />
    </div>
  }