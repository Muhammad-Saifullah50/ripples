'use client'
import { deleteRipple } from '@/lib/actions/ripple.actions'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React from 'react'

interface Props {
    rippleId: string
    currentUserId: string
    authorId: string
    parentId: string | null
    isComment: boolean | undefined
}
const DeleteRipple = ({ rippleId, currentUserId, authorId, parentId, isComment }: Props) => {

    const pathname = usePathname();
    const router = useRouter();

    if (currentUserId !== authorId || pathname === '/') return null
    return (
        <Image
            src='/assets/delete.svg'
            alt='delete'
            width={18}
            height={18}
            className='object-contain cursor-pointer'
            onClick={async () => {
                await deleteRipple(JSON.parse(rippleId), pathname);
                if (!parentId || !isComment) {
                    router.push('/')
                }
            }}
        />
    )
}

export default DeleteRipple
