import { Link } from "react-router";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { loginSchema } from "../schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";

import useAuthStore from "../store/useAuthStore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const { loginUser, loading } = useAuthStore();

  const handleLogin = async (userdata) => {
    await loginUser(userdata);

    const { success, error } = useAuthStore.getState();

    if (success) {
      toast.success(success);

      reset();
    }

    if (error) {
      toast.error(error);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-30">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your credentials below to login to your account
        </CardDescription>
        <CardAction>
          <Link to="/register">
            <Button variant="link">Sign Up</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Username</Label>
              <Input
                id="email"
                type="text"
                placeholder="johndoe"
                autoFocus
                {...register("username")}
              />
              {errors.username && (
                <small className="text-red-500" role="alert">
                  {errors.username.message}
                </small>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline p-0  "
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <small className="text-red-500" role="alert">
                  {errors.password.message}
                </small>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full mt-7">
            <span className={`${loading && "hidden"}`}> Sign In</span>
            <Loader2
              className={`w-12 h-12 animate-spin ${!loading && "hidden"}`}
            />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
