import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { formatRelativeTime } from "@/lib/utils";
import { UseAuthContext } from "@/context/AuthContext";
import profile from "../../../public/assets/images/icons8-test-account-96.png";
import postPlaceholder from "../../../public/assets/images/icons8-post-96.png";
import PostStats from "./PostStats";
type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = UseAuthContext();
  if (!post.creator) return;
  return (
    <div className="post-card">
      <div className="flex-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={post.creator.imageUrl || profile}
              className="w-12 h-12 rounded-full"
              alt="profile"
            />
          </Link>
          <div>
            <p className="base-medium capitalize lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex gap-2 text-light-3 items-center">
              <p className="lg:small-regular subtle-semibold">
                {formatRelativeTime(post.$createdAt)}
              </p>
              -
              <p className="capitalize lg:small-regular subtle-semibold">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        {post.creator.$id === user.id && (
          <Link to={`/update-post/${post.$id}`}>
            <img
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
        )}
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium py-5 lg:base-medium">
          <p className="capitalize font-bold">{post.caption}</p>
          <ul className="flex gap-1 flex-wrap mt-4">
            {post.tags.map((tag: string) => (
              <li key={tag} className="text-light-4 text-sm">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        {post.imageUrl ? (
          <img src={post.imageUrl} alt="post-image" className="post-card_img" />
        ) : (
          <div className="h-[200px] lg:h-[250px] flex-center bg-dark-1 rounded-2xl">
            <img
              src={postPlaceholder}
              alt="post-image"
              className="w-[200px] h-[200px]"
            />
          </div>
        )}
      </Link>
      <PostStats post={post} userId={user.id} largeStats={true} />
    </div>
  );
};

export default PostCard;
