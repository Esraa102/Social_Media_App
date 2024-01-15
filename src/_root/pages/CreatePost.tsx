import PostForm from "@/components/forms/PostForm";
import add from "../../../public/assets/icons/add-post.svg";
const CreatePost = () => {
  return (
    <div className="flex flex-1 h-full">
      <div className="common-container">
        <h2 className="flex gap-3">
          <img src={add} alt="create-post" className="invert-white w-10 h-10" />
          <span className="h3-bold md:h2-bold ">Create Post</span>
        </h2>
        <PostForm action="create" />
      </div>
    </div>
  );
};

export default CreatePost;
