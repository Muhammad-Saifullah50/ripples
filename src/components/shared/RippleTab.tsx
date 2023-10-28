import { fetchUser, fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import RippleCard from "../cards/RippleCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import CommentCard from "../cards/CommentCard";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
    areComments?: boolean;
}

const RippleTab = async ({
    currentUserId,
    accountId,
    accountType,
    areComments,
}: Props) => {
    let result: any;

    if (accountType === 'Community') {
        result = await fetchCommunityPosts(accountId);
    } else {
        result = await fetchUserPosts(accountId);
        // console.log(result)
    }

    if (!result) redirect('/');

    const user = await fetchUser(currentUserId)
    const userId = user._id.toString()

    const ripplesWithComments = result.ripples.filter((ripple: any) => {
        return ripple?.children?.length > 0;
    })

    const userRipplesWithComments = ripplesWithComments.filter((ripple: any) => {
        return ripple.author.toString() === userId;
    })

    return (
        <section className="mt-9 flex flex-col gap-10">
            {areComments ? (
                userRipplesWithComments?.map((comment: any) => {
                    return (
                        <div>
                            {comment.children.map((child: any) => {
                                // console.log(child, 'child')
                                return (
                                    <CommentCard
                                        text={child.text}
                                        name={child.author.name}
                                        createdAt={child.createdAt}
                                        image={child.author.image}
                                    />
                                )
                            })
                            }
                        </div>
                    )
                })
            ) : (
                result.ripples.map((ripple: any) => (
                    <RippleCard
                        key={ripple?._id}
                        id={ripple?._id}
                        currentUserId={currentUserId}
                        parentId={ripple?.parentId}
                        content={ripple.text}
                        author={
                            accountType === 'User'
                                ? { name: result.name, image: result.image, id: result.id }
                                : {
                                    name: ripple.author.name,
                                    image: ripple.author.image,
                                    id: ripple.author.id,
                                }
                        }
                        community={
                            accountType === 'Community'
                                ? { name: result.name, id: result.id, image: result.image }
                                : ripple.community
                        }
                        createdAt={ripple?.createdAt}
                        comments={ripple?.children}
                    />
                ))
            )}
        </section>
    );
};

export default RippleTab;
