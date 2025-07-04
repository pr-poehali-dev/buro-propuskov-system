import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const navigation = [
    { name: "Главная", href: "/", icon: "Home", roles: ["admin", "operator"] },
    {
      name: "Регистрация посетителей",
      href: "/visitors",
      icon: "Users",
      roles: ["admin", "operator"],
    },
    {
      name: "Управление сотрудниками",
      href: "/employees",
      icon: "UserCheck",
      roles: ["admin", "operator"],
    },
    {
      name: "Управление корпусами",
      href: "/buildings",
      icon: "Building",
      roles: ["admin"],
    },
    {
      name: "Операторы",
      href: "/operators",
      icon: "UserCog",
      roles: ["admin"],
    },
  ];

  const filteredNavigation = navigation.filter(
    (item) => currentUser && item.roles.includes(currentUser.role),
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white shadow-lg transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-16",
        )}
      >
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <h1 className="font-bold text-gray-900">Бюро пропусков</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      currentUser?.role === "admin" ? "default" : "secondary"
                    }
                  >
                    {currentUser?.role === "admin"
                      ? "Администратор"
                      : "Оператор"}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredNavigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <Icon name={item.icon} size={20} />
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t space-y-2">
          {sidebarOpen && currentUser && (
            <div className="text-xs text-gray-600 mb-2">
              <p className="font-medium">{currentUser.fullName}</p>
              <p>
                Смена:{" "}
                {currentUser.shift === "morning"
                  ? "Утренняя"
                  : currentUser.shift === "evening"
                    ? "Вечерняя"
                    : "Ночная"}
              </p>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Icon name="LogOut" size={16} />
            {sidebarOpen && <span className="ml-2">Выйти</span>}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full justify-start"
          >
            <Icon
              name={sidebarOpen ? "ChevronLeft" : "ChevronRight"}
              size={16}
            />
            {sidebarOpen && <span className="ml-2">Свернуть</span>}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
