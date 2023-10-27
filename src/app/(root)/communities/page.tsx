import CommunityCard from "@/components/cards/CommunityCard"
import UserCard from "@/components/cards/UserCard"
import Pagination from "@/components/shared/Pagination"
import SearchBar from "@/components/shared/SearchBar"
import { fetchCommunities } from "@/lib/actions/community.actions"
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from 'next/navigation'

const CommunityPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {

  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)

  if (!userInfo?.onboarded) redirect('/onboarding')

  // fetch all communities
  const result = await fetchCommunities({
    searchString: searchParams?.q || '',
    pageNumber: searchParams?.page ? +searchParams?.page : 1,
    pageSize: 10
  })
  return (
    <section>
      <h1 className="head-text mb-10">
        Communities
      </h1>
      <SearchBar routeType="communities" />

      <div className="mt-14 flex flex-col gap-9">
        {result.communities.length === 0 ? (
          <p className="no-result">No communities found</p>
        ) : (
          <>
            {result.communities.map((community) => {
              // console.log(community, 'community')
              return (
                <CommunityCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  bio={community.bio}
                  members={community.members}
                />
              )
            })}
          </>
        )}
      </div>

      <Pagination
        pageNumber={searchParams?.page ? +searchParams?.page : 1}
        isNext={result.isNext}
        path='communities'
      />
    </section>
  )
}

export default CommunityPage