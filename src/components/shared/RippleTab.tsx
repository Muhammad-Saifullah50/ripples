import { fetchUserPosts } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import RippleCard from "../cards/RippleCard"
import { fetchCommunityPosts } from "@/lib/actions/community.actions"

interface Props {
    currentUserId: string
    accountId: string
    accountType: string
}
const RippleTab = async ({ currentUserId, accountId, accountType }: Props) => {

    let result: any;

    if (accountType === 'Community') {
        result = await fetchCommunityPosts(accountId)
    } else {
        result = await fetchUserPosts(accountId)
    }
    if (!result) redirect('/')
    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.ripples.map((ripple: any) => (
                <RippleCard
                    key={ripple?._id}
                    id={ripple?._id}
                    currentUserId={currentUserId}
                    parentId={ripple?.parentId}
                    content={ripple.text}
                    author={
                        accountType === 'User'
                            ? { name: result.name, image: result.image, id: result.id }
                            : { name: ripple.author.name, image: ripple.author.image, id: ripple.author.id }
                    }
                    community={ripple?.community}
                    createdAt={ripple?.createdAt}
                    comments={ripple?.children}
                />
            ))}
        </section>
    )
}

export default RippleTab