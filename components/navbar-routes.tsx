"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacher = pathname?.startsWith("/teacher");
  const isStudent = pathname?.includes("/chapter");
  return (
    <div className="flex items-center justify-between gap-4">
      {isTeacher || isStudent ? (
        <Link href={"/"}>
          <Button
            size={"sm"}
            variant={"ghost"}
            className="flex justify-between items-center self-center font-samim"
          >
            خروج
            <LogOut className="h-4 w-4 mr-2" />
          </Button>
        </Link>
      ) : (
        <Link href={"/teacher/courses"}>
          <Button size={"sm"} variant={"outline"}>
            Instructor Mode
          </Button>
        </Link>
      )}
      <UserButton />
    </div>
  );
};

export default NavbarRoutes;
