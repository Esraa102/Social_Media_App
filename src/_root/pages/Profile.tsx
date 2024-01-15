import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { UseAuthContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { formatRelativeTime } from "@/lib/utils";
import { Models } from "appwrite";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const { data: user, isLoading } = useGetUserById(id);
  const { user: currentUser } = UseAuthContext();
  console.log(user);
  const [show, setShow] = useState("posts");

  if (isLoading) return <Loader miniLoader />;
  if (!user) return;
  return (
    <div className="profile-container ">
      <div className="profile-inner_container">
        <div className="flex  gap-4">
          <img
            src={user.imageUrl}
            className="h-28 w-28 lg:w-40 lg:h-40 rounded-full"
          />
          <div className="flex flex-col justify-between py-2">
            <div>
              <p className="text-2xl md:text-3xl lg:text-4xl font-semibold capitalize">
                {user.name}
              </p>
              <p className="text-lg text-light-3">@{user.username}</p>
            </div>
            <div className="flex my-6 items-center gap-3 md:gap-6 flex-wrap">
              <p className="text-sm md:text-lg font-semibold">
                <span className="text-light-3 inline-block mr-2">
                  {user.posts.length}
                </span>
                <span>Posts</span>
              </p>
              <p className="text-sm md:text-lgfont-semibold">
                <span className="text-light-3 inline-block mr-2">25</span>
                <span>Followers</span>
              </p>
              <p className="text-sm md:text-lg font-semibold">
                <span className="text-light-3 inline-block mr-2">25</span>
                <span>Following</span>
              </p>
            </div>
          </div>
        </div>
        {currentUser.id === user.$id && (
          <Link
            to={`/update-profile/${user.$id}`}
            className="text-sm flex gap-2 items-center rounded-lg shad-button_dark_4"
          >
            <img
              src="/public/assets/icons/edit.svg"
              className="w-6 h-6"
              alt="edit"
            />
            <span>Update Profile</span>
          </Link>
        )}
      </div>
      {user.bio && (
        <p className="text-center font-semibold lg:text-start text-xl my-10 capitalize w-full break-words">
          Bio: {user.bio}
        </p>
      )}
      <div className="flex items-center gap-3 mb-20 flex-wrap">
        <button
          type="button"
          onClick={() => setShow("posts")}
          className={`profile-tab px-[10px]
          ${show === "posts" ? "bg-dark-4" : "bg-dark-2 "}`}
        >
          <img src="/public/assets/icons/posts.svg" alt="posts" />
          <span>Posts</span>
        </button>
        <button
          type="button"
          onClick={() => setShow("liked")}
          className={`profile-tab px-[10px]
          ${show === "liked" ? "bg-dark-4" : "bg-dark-2"}`}
        >
          <img src="/public/assets/icons/like.svg" alt="liked" />
          <span>Liked </span>
        </button>
        <button
          type="button"
          onClick={() => setShow("saved")}
          className={`profile-tab px-[10px]
          ${show === "saved" ? "bg-dark-4" : "bg-dark-2"}`}
        >
          <img src="/public/assets/icons/saved.svg" alt="saved" />
          <span>Saved </span>
        </button>
      </div>
      <div>
        {show === "posts" && user.posts.length === 0 && (
          <p className="text-center text-light-3 mt-20">You Have No Posts</p>
        )}
        {show === "liked" && user.liked.length === 0 && (
          <p className="text-center text-light-3 mt-20">
            You Have No LIked Posts
          </p>
        )}
        {show === "saved" && user.save.length === 0 && (
          <p className="text-center text-light-3 mt-20">
            You Have No Saved Posts
          </p>
        )}
        {show === "posts" && user.posts.length > 0 && (
          <ul className="grid-container">
            {user.posts.map((post: Models.Document) => (
              <li
                key={post.$id}
                className="relative  overflow-hidden rounded-xl profile-post-card"
              >
                <Link to={`/posts/${post.$id}`} className="block h-[300px]">
                  <img
                    src={post.imageUrl}
                    alt="post"
                    className="w-full h-full"
                  />
                </Link>
                <div
                  className="absolute ease-in-out duration-300 
                     p-4 bg-dark-1/80 w-full post-footer"
                >
                  <p className=" text-lg capitalize font-semibold break-words">
                    {post.caption}
                  </p>
                  <p className="text-light-3 text-sm">
                    Created: {formatRelativeTime(post.$createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {show === "liked" && user.liked.length > 0 && (
          <GridPostList posts={user.liked} showStats={false} />
        )}
        {
          show === "saved" && user.save.length > 0 && (
            <ul className="grid-container">
              {user.save.map((item: Models.Document) => (
                <li
                  key={item.$id}
                  className="rounded-xl overflow-hidden relative profile-post-card"
                >
                  <Link to={`/posts/${item.post.$id}`}>
                    <img src={item.post.imageUrl} alt="post" />
                  </Link>
                  <p
                    className="absolute ease-in-out duration-300 
                     p-4 bg-dark-1/80 w-full post-footer  text-lg capitalize font-semibold break-words"
                  >
                    {item.post.caption}
                  </p>
                </li>
              ))}
            </ul>
          )

          //     <li key={`post-${item.post.$id}`} className="relative">
          //       <Link
          //         to={`/posts/${item.post.$id}`}
          //         className="grid-post_link"
          //       >
          //         <img
          //           src={item.post.imageUrl}
          //           alt="post-image"
          //           className=" w-full h-full object-cover"
          //         />
          //       </Link>
          //       <div className="grid-post_user flex justify-between items-center">
          //         <div className="flex items-center gap-2">
          //           <Link to={`/profile/${item.post.creator.$id}`}>
          //             <img
          //               src={item.post.creator.imageUrl}
          //               alt="creator"
          //               className="w-10 h-10 rounded-full bg-dark-1"
          //             />
          //           </Link>
          //           <p className="text-light-2  capitalize text-lg">
          //             {item.post.creator.name}
          //           </p>
          //         </div>
          //       </div>
          //     </li>
          //   ))}
          // </ul>
        }
      </div>
    </div>
  );
};

export default Profile;
