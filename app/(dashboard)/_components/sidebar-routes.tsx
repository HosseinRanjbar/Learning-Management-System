"use client";

import { BarChart, Compass, icons, Layout, List } from "lucide-react";
import { SidebarItem } from "./sidebar-items";
import { usePathname } from "next/navigation";

const guestRoutes = [
  {
    icon: Layout,
    label: "داشبورد",
    href: "/",
  },
  {
    icon: Compass,
    label: "جستجو",
    href: "/search",
  },
];
const teacherRoutes = [
  {
    icon: List,
    label: "دوره ها",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "آنالیز",
    href: "/teacher/analytics",
  },
];
export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacher = pathname?.includes("/teacher");
  const routes = isTeacher ? teacherRoutes : guestRoutes;
  return (
    <div className="flex flex-col w-full font-samim mt-[10px]">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
