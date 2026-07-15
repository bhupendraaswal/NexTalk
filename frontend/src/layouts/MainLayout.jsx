import { Link, Outlet } from "react-router";
import { useTheme } from "@/components/Theme/useTheme";

import { Loader2, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import useAuthStore from "../store/useAuthStore";
import { toast } from "sonner";

const MainLayout = () => {
  const { theme, setTheme } = useTheme();
  const { user, logoutUser, loading } = useAuthStore();

  const handleLogout = async () => {
    await logoutUser();

    const { success, error } = useAuthStore.getState();

    if (success) {
      toast.success(success);
    }

    if (error) {
      toast.error(error);
    }
  };

  return (
    <main className="container h-dvh mx-auto flex flex-col px-2 md:px-5 lg:px-7 xl:px-10">
      <nav className="flex items-center justify-between py-4 2xl:py-6 flex-shrink-0">
        <h1 className="text-xl lg:text-3xl 2xl:text-5xl">Chatty</h1>

        <div className="flex items-center gap-4">
          {!user ? (
            <Link to="/login">
              <Button>Login </Button>
            </Link>
          ) : (
            <Button className={`${loading && "hidden"}`} onClick={handleLogout}>
              Logout
              <Loader2
                className={`w-12 h-12 animate-spin ${!loading && "hidden"}`}
              />
            </Button>
          )}
          {theme?.toLowerCase() === "light" ? (
            <Moon className="cursor-pointer" onClick={() => setTheme("dark")} />
          ) : (
            <Sun className="cursor-pointer" onClick={() => setTheme("light")} />
          )}
        </div>
      </nav>

      <section className="flex-1 min-h-0">
        <Outlet />
      </section>
    </main>
  );
};

export default MainLayout;
