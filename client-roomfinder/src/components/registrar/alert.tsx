const Alert = ({ message }: { message: string }) => {
    return (
        <>
            <div className="mt-1 text-tiny border-l-4 border-red-500 text-red-500 p-2" role="alert">
                <p className="font-semibold">Error</p>
                <p className="">{message}</p>
            </div>
        </>
    );
}

export default Alert;