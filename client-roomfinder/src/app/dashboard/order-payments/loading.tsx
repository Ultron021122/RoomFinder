import { Spinner } from "@nextui-org/react";


export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Spinner />
      </div>
    </div>
  )
}
