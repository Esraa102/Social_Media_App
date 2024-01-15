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
import { signInFormSchema } from "@/lib/validation/formsSchema";
import logo from "../../../public/assets/images/logo.svg";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";
import { useSignInUserAccountMutation } from "@/lib/react-query/queriesAndMutations";
import { UseAuthContext } from "@/context/AuthContext";
const SignInForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutateAsync: signInUserAccount, isPending: isSigningIn } =
    useSignInUserAccountMutation();
  const { checkAuthUser } = UseAuthContext();
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    const session = await signInUserAccount({
      email: values.email,
      password: values.password,
    });
    console.log(session);
    if (!session) {
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your Sign In.",
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
  }
  return (
    <div className="text-white flex flex-col items-center gap-3  w-full">
      <div>
        <img src={logo} alt="logo" className="w-[140px] mb-5 mx-auto" />
        <p className="h3-bold md:h2-bold text-center">Log In To Your Account</p>
        <p className="text-light-3 text-center mt-2 small-medium  md:base-regular">
          Welcome Back To Snapgram! Enter Your Details
        </p>
      </div>
      <div className="w-[90%] p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              {isSigningIn ? (
                <div className="py-4 flex items-center gap-2">
                  <Loader miniLoader={true} />
                  <span>Logging In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <p className="text-light-2 -mt-2 text-small">
        Don't Have An Account?
        <Link
          to="/sign-up"
          className="font-semibold
        hover:text-primary-600 hover:underline transition ml-1"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignInForm;
