import { UseAuthContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridPostProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostProps) => {
  const { user } = UseAuthContext();
  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={`grid-post-${post.$id}`} className="relative">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={post.imageUrl}
              alt="post-image"
              className=" w-full h-full object-cover"
            />
          </Link>
          <div className="grid-post_user flex justify-between items-center">
            {showUser && (
              <div className="flex items-center gap-2">
                <Link to={`/profile/${post.creator.$id}`}>
                  <img
                    src={post.creator.imageUrl}
                    alt="creator"
                    className="w-10 h-10 rounded-full bg-dark-1"
                  />
                </Link>
                <p className="text-light-2  capitalize text-lg">
                  {post.creator.name}
                </p>
              </div>
            )}
            {showStats && (
              <PostStats largeStats={false} post={post} userId={user.id} />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
