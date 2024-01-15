/* eslint-disable react-hooks/exhaustive-deps */
import {
  useDeleteSavedPost,
  useLikePosts,
  useSavePost,
  useGetCurrentUser,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
  largeStats: boolean;
};

const PostStats = ({ post, userId, largeStats }: PostStatsProps) => {
  const likesList = post?.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);
  const { mutate: likePost } = useLikePosts();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isSavingPost } =
    useDeleteSavedPost();
  const { data: currentUser, isLoading: isDeletingSavedPost } =
    useGetCurrentUser();
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  );
  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);
  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(userId);
    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);
    likePost({ postId: post?.$id || "", likesArray: newLikes });
  };
  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
      console.log("Deleted");
    } else {
      setIsSaved(true);
      savePost({ postId: post?.$id || "", userId });
      console.log("Added");
    }
  };
  return (
    <div
      className={`flex items-center gap-2 justify-between z-20 ${
        largeStats && "mt-10"
      }`}
    >
      <div className={`flex items-center ${largeStats ? "gap-3" : "gap-1"}`}>
        <button>
          <img
            src={
              checkIsLiked(likes, userId)
                ? "/public/assets/icons/liked.svg"
                : "/public/assets/icons/like.svg"
            }
            width={20}
            height={20}
            onClick={handleLikePost}
            alt="like"
          />
        </button>
        <span
          className={largeStats ? "small-medium lg:base-medium" : "text-sm"}
        >
          {likes.length}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <button className={"flex items-center gap-2"}>
          {isSavingPost || isDeletingSavedPost ? (
            <Loader miniLoader />
          ) : (
            <img
              src={
                isSaved
                  ? "/public/assets/icons/saved.svg"
                  : "/public/assets/icons/save.svg"
              }
              width={20}
              height={20}
              onClick={handleSavePost}
              alt="save"
            />
          )}
          {largeStats && <span>{isSaved ? "Saved" : "Save"}</span>}
        </button>
      </div>
    </div>
  );
};

export default PostStats;
