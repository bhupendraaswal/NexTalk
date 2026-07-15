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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { forgotPasswordSchema } from "../schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import useAuthStore from "../store/useAuthStore";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const { loading, forgotPassword } = useAuthStore();

  const handleForgotPassword = async (data) => {
    await forgotPassword(data);

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
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email to reset your password
        </CardDescription>
        <CardAction>
          <Link to="/login">
            <Button variant="link">Sign In</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleForgotPassword)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                autoFocus="true"
                {...register("email")}
              />
              {errors.email && (
                <small className="text-red-500" role="alert">
                  {errors.email.message}
                </small>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full mt-7">
            <span className={`${loading && "hidden"}`}> Forgot Password</span>
            <Loader2
              className={`w-12 h-12 animate-spin ${!loading && "hidden"}`}
            />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
