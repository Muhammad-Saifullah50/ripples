"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Ripple from "../models/ripple.model"; 
import Community from "../models/community.model";

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level ripples) (a ripple that is not a comment/reply).
  const postsQuery = Ripple.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts (ripples) i.e., ripples that are not comments.
  const totalPostsCount = await Ripple.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createRipple({ text, author, communityId, path }: Params
) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdRipple = await Ripple.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { ripples: createdRipple._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { ripples: createdRipple._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create ripple: ${error.message}`);
  }
}

async function fetchAllChildRipples(rippleId: string): Promise<any[]> {
  const childRipples = await Ripple.find({ parentId: rippleId });

  const descendantRipples = [];
  for (const childRipple of childRipples) {
    const descendants = await fetchAllChildRipples(childRipple._id);
    descendantRipples.push(childRipple, ...descendants);
  }

  return descendantRipples;
}

export async function deleteRipple(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the ripple to be deleted (the main ripple)
    const mainRipple = await Ripple.findById(id).populate("author community");

    if (!mainRipple) {
      throw new Error("ripple not found");
    }

    // Fetch all child ripples and their descendants recursively
    const descendantRipples = await fetchAllChildRipples(id);

    // Get all descendant ripple IDs including the main ripple ID and child ripple IDs
    const descendantRippleIds = [
      id,
      ...descendantRipples.map((ripple) => ripple._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantRipples.map((ripple) => ripple.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainRipple.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantRipples.map((ripple) => ripple.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainRipple.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child ripples and their descendants
    await Ripple.deleteMany({ _id: { $in: descendantRippleIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { ripples: { $in: descendantRippleIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { ripples: { $in: descendantRippleIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete ripple: ${error.message}`);
  }
}

export async function fetchRippleById(rippleId: string) {
  connectToDB();

  try {
    const ripple = await Ripple.findById(rippleId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Ripple, // The model of the nested children (assuming it's the same "ripple" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return ripple;
  } catch (err) {
    console.error("Error while fetching ripple", err);
    throw new Error("Unable to fetch ripple");
  }
}

export async function addCommentToRipple(
  rippleId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original ripple by its ID
    const originalRipple = await Ripple.findById(rippleId);

    if (!originalRipple) {
      throw new Error("Ripple not found");
    }

    // Create the new comment ripple
    const commentRipple = new Ripple({
      text: commentText,
      author: userId,
      parentId: rippleId, // Set the parentId to the original ripple's ID
    });

    // Save the comment ripple to the database
    const savedCommentRipple = await commentRipple.save();

    // Add the comment ripple's ID to the original ripple's children array
    originalRipple.children.push(savedCommentRipple._id);

    // Save the updated original ripple to the database
    await originalRipple.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}