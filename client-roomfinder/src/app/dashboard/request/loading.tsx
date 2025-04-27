import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Spinner />
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">Cargando administración de solicitudes...</p>
      </div>
    </div>
  )
}
