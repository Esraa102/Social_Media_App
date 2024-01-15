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
import { Input } from "@/components/ui/input";
import { signupFormSchema } from "@/lib/validation/formsSchema";
import logo from "../../../public/assets/images/logo.svg";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateUserAccountMutation,
  useSignInUserAccountMutation,
} from "@/lib/react-query/queriesAndMutations";
import { UseAuthContext } from "@/context/AuthContext";
const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutateAsync: createUserAccount, isPending: isCreating } =
    useCreateUserAccountMutation();
  const { mutateAsync: signInUserAccount } = useSignInUserAccountMutation();
  const { checkAuthUser } = UseAuthContext();
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupFormSchema>) {
    const newUser = await createUserAccount(values);
    if (!newUser) {
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your Sign Up.",
      });
    }
    const session = await signInUserAccount({
      email: values.email,
      password: values.password,
    });
    if (!session) {
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your Sign Up.",
      });
    }
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your Sign In.",
      });
    }

    console.log(isLoggedIn);
  }
  return (
    <div className="text-white flex flex-col items-center gap-3  w-full">
      <div>
        <img src={logo} alt="logo" className="w-[140px] mb-5 mx-auto" />
        <p className="h3-bold md:h2-bold">Create A New Account</p>
        <p className="text-light-3 text-center small-medium  md:base-regular">
          To use snapgram enter your details
        </p>
      </div>
      <div className="w-[90%] p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      placeholder="Enter Your Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      placeholder="Enter Your Username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="shad-input"
                      placeholder="Enter Your Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red" />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="shad-input"
                      placeholder="Enter Your Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="shad-button_primary w-full text-lg"
            >
              {isCreating ? (
                <div className="py-4 flex items-center gap-2">
                  <Loader miniLoader={true} />
                  <span>Sending...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <p className="text-light-2 -mt-2 text-small">
        Already Have An Account?
        <Link
          to="/sign-in"
          className="font-semibold
        hover:text-primary-600 hover:underline transition ml-1"
        >
          Log In
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
