import RippleCard from "@/components/cards/RippleCard"
import Pagination from "@/components/shared/Pagination"
import { fetchPosts } from "@/lib/actions/ripple.actions"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from '@clerk/nextjs'
import { redirect } from "next/navigation"

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {

  const user = await currentUser()

  let userInfo = await fetchUser(user?.id)  

  const result = await fetchPosts(searchParams?.page ? +searchParams?.page : 1, 20)



  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result?.posts?.length === 0 ? (
          <p className="no-result">No ripples found</p>
        ) : (
          <>
            {result?.posts.map((post) => {
              return (
                <RippleCard
                  key={post?._id}
                  id={post?._id}
                  currentUserId={user?.id || ''}
                  parentId={post?.parentId}
                  content={post.text}
                  author={post?.author}
                  community={post?.community}
                  createdAt={post?.createdAt}
                  comments={post?.children}
                />

              )
            })}
          </>
        )}
      </section>

      <Pagination
        path="/"
        pageNumber={searchParams?.page ? + searchParams?.page : 1}
        isNext={result?.isNext}
      />
    </>
  )
}

