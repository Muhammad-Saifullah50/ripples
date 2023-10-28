import { PostRipple } from "@/components/forms"
import { ProfileHeader, RippleTab } from "@/components/shared"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from 'next/navigation'
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from "@/constants"
import Image from "next/image"

const ProfilePage = async ({ params }: { params: { id: string } }) => {

  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(params.id)

  if (!userInfo?.onboarded) redirect('/onboarding')

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue='ripples' className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  height={24}
                  width={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === 'Ripples' && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.ripples?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value="ripples"
            className="w-full text-light-1"
          >
            <RippleTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="User"
            />
          </TabsContent>

          <TabsContent
            value="replies"
            className="w-full text-light-1"
          >
           <RippleTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="User"
              areComments
            />
          </TabsContent>


        </Tabs>
      </div>
    </section>
  )
}

export default ProfilePage