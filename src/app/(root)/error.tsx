'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useEffect } from 'react'

export default function Error({ error, reset, }
    : {
        error: Error & { digest?: string }
        reset: () => void
    }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="text-light-1 w-full min-h-[75vh] flex flex-col gap-5 items-center justify-center max-sm:p-5">
            <Image
                src='/assets/logo.svg'
                alt="logo"
                width={40}
                height={40}
                className="rounded-full object-contain"
            />
            <h1 className="text-heading1-bold">500</h1>
            <p className="text-center"> Oops! Something went wrong</p>
            <p className="text-center">Please try again</p>
            <Button 
            className='bg-primary-500 hover:bg-tertiary-500'
            onClick={() => reset()}>
                Try Again
            </Button>
        </div>
    )
}
