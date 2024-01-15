import { Models } from "appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "../shared/FileUploader";
import { Input } from "../ui/input";
import { profileFormSchema } from "@/lib/validation/formsSchema";
import { z } from "zod";
import { useUpdateProfile } from "@/lib/react-query/queriesAndMutations";
import { toast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/Loader";

const ProfileForm = ({ profile }: { profile: Models.Document }) => {
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile.name,
      bio: profile.bio || "",
      file: [],
    },
  });
  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    const updatedProfile = await updateProfile({
      ...values,
      userId: profile.$id,
      imageId: profile.imageId,
      imageUrl: profile.imageUrl,
    });
    if (!updatedProfile) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Please Try Again.",
      });
    }
    navigate(`/profile/${profile.$id}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-5xl flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Your Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your name"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Choose A Photo</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={profile.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Your Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Introduce yourself (optional)"
                  className="shad-textarea"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="w-fit shad-button_dark_4">
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-fit shad-button_primary"
            disabled={isPending}
          >
            {isPending ? (
              <div className="py-4 flex items-center gap-2">
                <Loader miniLoader={true} />
                <span>Updating...</span>
              </div>
            ) : (
              "Update Profile"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
