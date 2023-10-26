import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { redirect } from 'next/navigation'
const ActivityPage = async () => {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)

  if (!userInfo?.onboarded) redirect('/onboarding')

  //get actiovity
  const activity = await getActivity(userInfo._id)
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link
                key={activity._id} href={`/ripple/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity.author.image}
                    alt='profile'
                    width={20}
                    height={20}
                    className="object-cover rounded-full"
                  />

                  <p className="!text-small-regular text-light-1 flex gap-2">
                    <span className="mr-1 text-primary-500">{activity.author.name}</span>{' '}
                    replied to your ripple at{' '}
                    <span className="!text-small-medium text-gray-600">
                      {activity.createdAt.toLocaleString().slice(11, 16) + (activity.createdAt.toLocaleString().slice(-2) === 'AM' ? ' AM' : ' PM')}
                    </span>
                  </p>

                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity found</p>
        )}
      </section>
    </section >
  )
}

export default ActivityPage