import { Link, useNavigate } from "react-router";
import { Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Ghost className="w-16 h-16 text-muted-foreground mb-4 animate-bounce" />

      <h1 className="text-4xl font-bold tracking-tight mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <Button
        className="cursor-pointer hover:bg-background hover:text-black"
        variant="default"
        onClick={() => navigate("/")}
      >
        Go Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
