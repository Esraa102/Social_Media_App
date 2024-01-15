import * as z from "zod";
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
import { postFormSchema } from "@/lib/validation/formsSchema";
import { Models } from "appwrite";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutations";
import { UseAuthContext } from "@/context/AuthContext";
import { toast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/Loader";
type PostFormProps = {
  post?: Models.Document;
  action: "create" | "update";
};
const PostForm = ({ action, post }: PostFormProps) => {
  const { user } = UseAuthContext();
  const navigate = useNavigate();
  const { mutateAsync: createPost, isPending: isCreating } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost();
  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(", ") : "",
    },
  });
  async function onSubmit(values: z.infer<typeof postFormSchema>) {
    if (action === "create") {
      const newPost = await createPost({
        ...values,
        userId: user.id,
      });
      if (!newPost) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Please Try Again.",
        });
      }
      navigate("/");
    } else if (post && action === "update") {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      });
      if (!updatedPost) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Please Try Again.",
        });
      }
      navigate(`/posts/${post.$id}`);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-5xl flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter The Post Caption"
                  className="shad-textarea"
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
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add A Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a location"
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
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (Seperated By Commas ",")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: react js, JSM, front-end"
                  type="text"
                  className="shad-input"
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
            className={`w-fit shad-button_primary ${
              isCreating || isUpdating ? "cursor-not-allowed" : ""
            }`}
            disabled={isCreating || isUpdating}
          >
            {isCreating && action === "create" && (
              <div className="py-4 flex items-center gap-2">
                <Loader miniLoader={true} />
                <span>Creating...</span>
              </div>
            )}
            {isUpdating && action === "update" && (
              <div className="py-4 flex items-center gap-2">
                <Loader miniLoader={true} />
                <span>Updating...</span>
              </div>
            )}
            {!isCreating && action === "create" && "Create Post"}
            {!isUpdating && action === "update" && "Update Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
