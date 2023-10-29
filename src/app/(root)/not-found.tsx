import Image from "next/image"

const NotFound = () => {
    return (
        <div className="text-light-1 w-full min-h-[75vh] flex flex-col gap-5 items-center justify-center max-sm:p-5">
            <Image
            src='/assets/logo.svg'
            alt="logo"
            width={40}
            height={40}
            className="rounded-full object-contain"
            />
            <h1 className="text-heading1-bold">404</h1>
            <p className="text-center"> Sorry! The requested page could not be found</p>
        </div>
    )
}

export default NotFound
