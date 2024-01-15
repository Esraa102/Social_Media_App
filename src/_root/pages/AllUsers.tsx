import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useGetAllUsers } from "@/lib/react-query/queriesAndMutations";
import { Link } from "react-router-dom";

const AllUsers = () => {
  const { data: allUsers, isLoading } = useGetAllUsers();
  console.log(allUsers);
  if (isLoading) return <Loader miniLoader />;
  return (
    <div className="flex flex-1 h-full common-container">
      <h2 className="flex gap-3">
        <img
          src={"/public/assets/icons/people.svg"}
          alt="people"
          className="invert-white w-10 h-10"
        />
        <span className="h3-bold md:h2-bold ">All Users</span>
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        {allUsers?.documents.map((user) => (
          <li key={user.$id} className="flex mb-8 items-center flex-col gap-4">
            <Link to={`/profile/${user.$id}`}>
              <img
                src={user.imageUrl}
                alt="profile"
                className="w-32 h-32 rounded-full"
              />
            </Link>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-semibold capitalize">
                {user.name}
              </p>
              <p className="text-sm text-light-3">@{user.username}</p>
            </div>
            <Button
              type="button"
              className="shad-button_primary text-lg 
              rounded-lg flex items-center gap-2"
            >
              <img
                src="/public/assets/icons/follow.svg"
                alt="follow"
                className="invert-white"
              />
              <span> Follow</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllUsers;
