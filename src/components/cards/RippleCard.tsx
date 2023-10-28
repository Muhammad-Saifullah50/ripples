import { formatDateString } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import DeleteRipple from "../forms/DeleteRipple"
import ShareRipple from "../shared/ShareRipple"
import { LikeRipple } from "../shared"

interface Props {
  id: string
  currentUserId: string
  parentId: string | null
  content: string
  author: {
    name: string,
    image: string,
    id: string
  }
  community: {
    id: string
    name: string,
    image: string
  } | null
  createdAt: string
  comments: {
    author: {
      image: string
    }
  }[],
  isComment?: boolean
}
const RippleCard = ({ id, currentUserId, parentId, content, author, community, createdAt, comments, isComment }: Props) => {
  return (
    <article className={`flex w-full flex-col rounded-xl  
    ${isComment ? 'px-0 xs:px-7 mt-3 ' : 'bg-dark-2 p-7'}`}>

      <div className="flex items-start justify-between">
        <div className="flex flex-1 w-full flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author?.id}`} className="relative h-11 w-11">
              <Image
                src={author?.image}
                alt="profile"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div className="ripple-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${author?.id}`} className="w-fit flex gap-10">
              <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
              <p className="text-gray-600 text-small-regular">{(formatDateString(createdAt))}</p>

            </Link>

            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-5">

                <LikeRipple rippleId={id}/>

                <div className="group flex flex-col">
                  <Link href={`/ripple/${id}`}>
                    <Image
                      src='/assets/reply.svg'
                      alt="reply"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                    />
                  </Link>
                  <div className="hidden group-hover:flex absolute z-50 text-[10px] text-light-1 mt-7 -ml-2">
                    <p >Comment</p>
                  </div>
                </div>

                <ShareRipple rippleId={id}/>
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/ripple/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} replies</p>
                </Link>
              )}
            </div>
          </div>
        </div>
        <DeleteRipple
          rippleId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>

      {!isComment && comments.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2" >
          {comments.slice(0, 2).map((comment, index) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && '-ml-5'} rounded-full object-cover`}

            />
          ))}

          <Link
            href={`ripple/${id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">

              {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
            </p>
          </Link>

        </div>
      )}
      {!isComment && community && (
        <Link
          href={`/communities/${community?.id}`}
          className="mt-5 flex items-center">
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}  {' '}- {community?.name} Community
          </p>
          <Image
            src={community.image}
            alt="image"
            width={14}
            height={14}
            className="object-cover rounded-full ml-1"
          />
        </Link>
      )}
    </article>
  )
}

export default RippleCard