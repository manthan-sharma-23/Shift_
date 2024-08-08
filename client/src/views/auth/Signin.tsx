import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Server from "@/core/api/api";
import { AuthenticateUser } from "@/core/types/user.types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signin = () => {
  const [user, setUser] = useState<Partial<AuthenticateUser>>({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (user.email && user.password) {
      setLoading(true);
      new Server().user
        .login_user({ email: user.email, password: user.password })
        .then((meta) => {
          console.log(meta);

          setLoading(false);
          if (meta.isLoggedIn) {
            toast.success(meta.message);
            setTimeout(() => {
              navigate("/app/projects");
            }, 1000);
          } else {
            toast.error(meta.message);
          }
        })
        .catch((err: { response: { data: { message: string } } }) => {
          setLoading(false);
          toast.error(err.response.data.message);
        });
    } else {
      toast.error("Please add both email and password !");
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              onChange={(e) => {
                setUser((user) => ({ ...user, email: e.target.value }));
              }}
              required
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              onChange={(e) => {
                setUser((user) => ({ ...user, password: e.target.value }));
              }}
              disabled={loading}
            />
          </div>
          <Button
            disabled={loading}
            onClick={handleLogin}
            type="submit"
            className="w-full"
          >
            Login
          </Button>
          <Button disabled={loading} variant="outline" className="w-full">
            Login with Github
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/auth/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Signin;
