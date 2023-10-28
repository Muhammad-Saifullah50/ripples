'use client'
import Image from 'next/image'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useState } from 'react'
const ShareRipple = ({ rippleId }: { rippleId: string }) => {
    const [copied, setCopied] = useState(false)
    const LinktoCopy = `https://ripples-kappa.vercel.app/ripple/${rippleId}`
    const handleCopy = () => {
        setCopied(true)
        navigator.clipboard.writeText(LinktoCopy)

        setTimeout(() => {
            setCopied(false)
    }, 10000)
    }
    return (
        <div className="group flex flex-col">


            <Dialog>
                <DialogTrigger>
                    <Image
                        src='/assets/share.svg'
                        alt="share"
                        width={24}
                        height={24}
                        className="cursor-pointer object-contain"
                    />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-light-1'>Share Ripple</DialogTitle>
                        <DialogDescription>
                            Copy the link below to share your ripple

                            <div className='mt-4 flex'>
                                <Input value={LinktoCopy} 
                                className='bg-transparent' />
                                <Button
                                    className='bg-transparent hover:bg-transparent' size='icon'
                                    onClick={handleCopy}>
                                    <Image
                                        src={!copied ? `/assets/copy.svg` : '/assets/tick.svg'}
                                        alt='copy'
                                        width={copied ? 30 : 20}
                                        height={copied ? 30 : 20}
                                        className='invert'
                                    />
                                </Button>
                            </div>
                        </DialogDescription>

                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose>
                            <Button className='bg-primary-500 hover:bg-tertiary-500'>Done</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <div className="absolute z-50 hidden group-hover:block text-[10px] text-light-1 mt-7 text-center">
                <p>Share</p>
            </div>

        </div>
    )
}

export default ShareRipple
