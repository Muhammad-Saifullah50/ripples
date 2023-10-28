'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '../ui/button'

const LikeRipple = ({ rippleId }: { rippleId: string }) => {

    const [liked, setLiked] = useState(false)

    const handleLike = () => {
        setLiked((prev) => !prev)
    }
    return (
        <div className="group flex flex-col">
            <Image
                src='/assets/heart-gray.svg'
                alt="heart"
                width={24}
                height={24}
                onClick={handleLike}
                className={`cursor-pointer object-contain ${liked ? 'invert' : ''}`}
            />

            <div className="hidden group-hover:block absolute z-50 text-[10px] text-light-1 mt-7 text-center">
                <p>Like</p>
            </div>
        </div>
    )
}

export default LikeRipple
