import ProfileForm from "@/components/forms/ProfileForm";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const UpdateProfile = () => {
  const { id } = useParams();
  const { data: currentUser } = useGetUserById(id);
  if (!currentUser) return;
  return (
    <div className="h-full flex flex-1">
      <div className="common-container">
        <div className="flex items-center gap-4">
          <img src="/public/assets/icons/edit.svg" alt="edit" />
          <h2 className="h3-bold md:h2-bold text-primary-600">Edit Profile</h2>
        </div>
        <ProfileForm profile={currentUser} />
      </div>
    </div>
  );
};

export default UpdateProfile;
