import PostRipple from "@/components/forms/PostRipple"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from 'next/navigation'

const CreateRipplePage = async () => {

    const user = await currentUser()
    if (!user) return null

    const userInfo = await fetchUser(user.id)

    if (!userInfo?.onboarded) redirect('/onboarding')
    return (
        <>
            <h1 className='head-text'>Create Ripple</h1>
            <PostRipple UserId={userInfo?._id}/>
        </>)
}

export default CreateRipplePage