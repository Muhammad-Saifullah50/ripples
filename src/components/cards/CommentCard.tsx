'use client'
import { formatDateString } from "@/lib/utils"
import Image from "next/image"

interface Props {
    text: string
    name: string
    createdAt: string
    image: string
}
const CommentCard = ({ text, name, createdAt, image }: Props) => {
    return (
        <article className="flex xs:px-7 w-full py-5 mt-3 gap-4 bg-dark-2 rounded-lg">

            <Image
                src={image}
                width={45}
                height={45}
                alt="profile"
                className="rounded-full object-contain flex self-start"
            />

            <div className="w-full">
                <div className="flex flex-wrap justify-between items-center">
                    <h4 className="text-base-semibold text-light-1">{name} commented</h4>
                    <p className="text-gray-600 text-small-regular">{(formatDateString(createdAt))}</p>
                </div>

                <div className="mt-2 text-small-regular text-light-2">{text}</div>
            </div>

        </article>
    )
}

export default CommentCard
