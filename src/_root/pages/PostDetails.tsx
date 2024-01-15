import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { UseAuthContext } from "@/context/AuthContext";
import {
  useDeletePost,
  useGetPostById,
} from "@/lib/react-query/queriesAndMutations";
import { formatRelativeTime } from "@/lib/utils";
import Loader from "@/components/shared/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isLoading } = useGetPostById(id);
  const { mutateAsync: deletePost, isPending } = useDeletePost();
  const { user } = UseAuthContext();
  const navigate = useNavigate();
  const handleDelete = () => {
    if (post) {
      deletePost({ postId: post.$id, imageId: post.imageId });
      navigate("/");
      console.log("Deleted");
    } else {
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "Please Try Again.",
      });
    }
  };
  if (isLoading) return <Loader miniLoader />;
  return (
    <div className="post_details-container flex flex-1 h-full">
      <div className="post_details-card">
        <img
          src={post?.imageUrl}
          alt="post-image"
          className="rounded-t-xl h-[500px] md:h-[600px] object-cover"
        />

        <div className="px-4 py-8">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b-[1px] border-b-dark-4">
            <Link to={`/profile/${post?.creator.$id}`}>
              <img
                src={post?.creator.imageUrl}
                alt="creator-profile-image"
                width={80}
                height={80}
                className="rounded-full"
              />
            </Link>
            <div>
              <p className="text-white text-xl md:text-3xl mb-1 font-semibold capitalize">
                {post?.creator.name}
              </p>
              <p className="text-light-3">@{post?.creator.username}</p>
            </div>
          </div>
          <h2 className="h3-bold mb-6 md:h2-bold ">{post?.caption}</h2>
          <ul className="flex w-full gap-2 mb-3 items-center flex-wrap">
            {post?.tags.map((tag: string) => (
              <li
                key={tag}
                className="text-primary-600 text-lg md:text-xl font-semibold"
              >
                #{tag}
              </li>
            ))}
          </ul>
          <div className="flex gap-3  text-light-3   text-sm">
            <p className="capitalize">Location: {post?.location}</p>-
            <p>Created: {formatRelativeTime(post?.$createdAt || "")}</p>
          </div>

          <PostStats post={post} userId={user.id} largeStats={true} />
          {user.id === post?.creator.$id && (
            <div className="flex gap-4 mt-8 justify-end items-center">
              <Button
                onClick={handleDelete}
                type="button"
                className={`shad-button_primary rounded-lg text-sm md:text-lg ${
                  isPending && "cursor-not-allowed"
                }`}
                disabled={isPending}
              >
                {isPending ? (
                  <div className="py-4 flex items-center gap-2">
                    <Loader miniLoader={true} />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  <img
                    src="/public/assets/icons/delete.svg"
                    className="w-6 h-6 md:w-8 md:h-8"
                    alt="delete"
                  />
                )}
              </Button>
              <Link
                to={`/update-post/${post.$id}`}
                className="bg-primary-600  text-sm md:text-lg hover:bg-primary-500 transition p-4 py-3 rounded-lg"
              >
                <img
                  src="/public/assets/icons/edit.svg"
                  className="invert-white w-6 h-6 md:w-8 md:h-8"
                  alt="edit"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
