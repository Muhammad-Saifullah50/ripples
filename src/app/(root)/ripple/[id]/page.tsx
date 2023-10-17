import RippleCard from "@/components/cards/RippleCard"
import { Comment } from "@/components/forms";
import { fetchRippleById } from "@/lib/actions/ripple.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";

const RippleDetails = async ({ params }: { params: { id: string } }) => {
    if (!params.id) return null

    const user = await currentUser();
    if (!user) return null

    const userInfo = await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect('/onboarding')

    const ripple = await fetchRippleById(params.id);
    return (
        <section className="relative">
            <div>
                <RippleCard
                    key={ripple?._id}
                    id={ripple?._id}
                    currentUserId={user?.id || ''}
                    parentId={ripple?.parentId}
                    content={ripple.text}
                    author={ripple?.author}
                    community={ripple?.community}
                    createdAt={ripple?.createdAt}
                    comments={ripple?.children}
                />
            </div>

            <div className="mt-7" >
                <Comment
                    rippleId={ripple.id}
                    currentUserImage={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            <div className="mt-10">
                {ripple.children.map((childItem: any) => (
                    <RippleCard
                        key={childItem?._id}
                        id={childItem?._id}
                        currentUserId={childItem?.id || ''}
                        parentId={childItem?.parentId}
                        content={childItem.text}
                        author={childItem?.author}
                        community={childItem?.community}
                        createdAt={childItem?.createdAt}
                        comments={childItem?.children}
                        isComment
                    />
                ))}
            </div>
        </section>
    )
}

export default RippleDetails