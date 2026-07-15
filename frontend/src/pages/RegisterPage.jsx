import { Link, useNavigate } from "react-router";

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
import { toast } from "sonner";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { registerSchema } from "../schemas/authSchema";

import useAuthStore from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const { registerUser, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (userdata) => {
    await registerUser(userdata);

    const { success, error } = useAuthStore.getState();

    if (success) {
      toast.success(success);

      navigate("/login");

      reset();
    }

    if (error) {
      toast.error(error);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-30">
      <CardHeader>
        <CardTitle>Create a new account</CardTitle>
        <CardDescription>
          Enter your details to create a new account
        </CardDescription>
        <CardAction>
          <Link to="/login">
            <Button variant="link">Sign In</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleRegister)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="jondoe"
                autoFocus
                {...register("username")}
                aria-invalid={errors.username ? "true" : "false"}
              />
              {errors.username && (
                <small className="text-red-500" role="alert">
                  {errors.username.message}
                </small>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <small className="text-red-500" role="alert">
                  {errors.email.message}
                </small>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <small className="text-red-500" role="alert">
                  {errors.password.message}
                </small>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full mt-7">
            <span className={`${loading && "hidden"}`}> Create Account</span>
            <Loader2
              className={`w-12 h-12 animate-spin ${!loading && "hidden"}`}
            />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterPage;
