import { fetchCommunities } from '@/lib/actions/community.actions'
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import { ClerkLoading, currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import CommunityCard from '../cards/CommunityCard'
import UserCard from '../cards/UserCard'

const RightSidebar = async () => {

  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  console.log(userInfo)

  if (!userInfo?.onboarded) redirect('/onboarding')

  // fetch all communities
  const communityResult = await fetchCommunities({
    searchString: '',
    pageNumber: 1,
    pageSize: 25
  })

  const userResult = await fetchUsers({
    userId: user.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 25
  })

  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>Suggested Communities</h3>
        <div className='flex flex-col gap-4 mt-4'>
          {communityResult.communities.length === 0 ? (
            <p className="no-result">No communities found</p>
          ) : (
            <>
              {communityResult.communities.map((community) => (
                <CommunityCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  bio={community.bio}
                  members={community.members}
                />

              ))}
            </>
          )}
        </div>
      </div>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>Suggested Users</h3>
        <div className='flex flex-col gap-4 mt-4'>
          {userResult.users.map((person) => (
            <UserCard
              key={person.id}
              id={person.id}
              name={person.name}
              username={person.username}
              imgUrl={person.image}
              personType='User'
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default RightSidebar