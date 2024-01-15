import PostForm from "@/components/forms/PostForm";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";

import { useParams } from "react-router-dom";

const UpdatePost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  if (isPending) return <Loader miniLoader />;
  return (
    <div className="h-full flex flex-1">
      <div className="common-container">
        <div className="flex items-center gap-4">
          <img
            src="/public/assets/icons/edit.svg"
            className="invert-white"
            alt="edit"
          />
          <h2 className="h3-bold md:h2-bold">Edit Post</h2>
        </div>
        <PostForm action="update" post={post} />
      </div>
    </div>
  );
};

export default UpdatePost;
