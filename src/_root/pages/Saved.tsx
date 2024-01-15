import Loader from "@/components/shared/Loader";
import { useGetSavedPosts } from "@/lib/react-query/queriesAndMutations";

import { Link } from "react-router-dom";

const Saved = () => {
  const { data: savedPosts, isLoading } = useGetSavedPosts();

  if (isLoading) return <Loader miniLoader />;
  return (
    <div className="h-full flex flex-1 common-container">
      <h2 className="flex gap-3">
        <img
          src="/public/assets/icons/saved.svg"
          alt="saved-posts"
          className="invert-white w-10 h-10"
        />
        <span className="h3-bold md:h2-bold ">Saved Posts</span>
      </h2>
      <ul className="mt-10 grid-container">
        {savedPosts?.documents.map((item) => (
          <li key={`post-${item.post.$id}`} className="relative">
            <Link to={`/posts/${item.post.$id}`} className="grid-post_link">
              <img
                src={item.post.imageUrl}
                alt="post-image"
                className=" w-full h-full object-cover"
              />
            </Link>
            <div className="grid-post_user flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Link to={`/profile/${item.post.creator.$id}`}>
                  <img
                    src={item.post.creator.imageUrl}
                    alt="creator"
                    className="w-10 h-10 rounded-full bg-dark-1"
                  />
                </Link>
                <p className="text-light-2  capitalize text-lg">
                  {item.post.creator.name}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Saved;
