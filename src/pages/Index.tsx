import {
  useVisitors,
  useEmployees,
  useBuildings,
} from "@/hooks/useLocalStorage";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

const Index = () => {
  const { visitors } = useVisitors();
  const { employees } = useEmployees();
  const { buildings } = useBuildings();

  const todayVisitors = visitors.filter((visitor) => {
    const today = new Date().toISOString().split("T")[0];
    return visitor.visitDate === today;
  });

  const activeEmployees = employees.filter((emp) => emp.status === "active");
  const pendingVisitors = visitors.filter(
    (visitor) => visitor.status === "pending",
  );

  const recentVisitors = visitors
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Панель управления
          </h1>
          <p className="text-gray-600 mt-1">Обзор системы пропусков</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Icon name="Calendar" size={16} />
          {new Date().toLocaleDateString("ru-RU", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Посетители сегодня"
          value={todayVisitors.length}
          change="+12% от вчера"
          changeType="positive"
          icon="Users"
          color="blue"
        />
        <StatCard
          title="Активные сотрудники"
          value={activeEmployees.length}
          change={`из ${employees.length} всего`}
          changeType="neutral"
          icon="UserCheck"
          color="green"
        />
        <StatCard
          title="Корпуса"
          value={buildings.length}
          icon="Building"
          color="purple"
        />
        <StatCard
          title="Ожидают одобрения"
          value={pendingVisitors.length}
          change="Требует внимания"
          changeType="negative"
          icon="Clock"
          color="orange"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Activity" size={20} />
              Последние посетители
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVisitors.length > 0 ? (
                recentVisitors.map((visitor) => (
                  <div
                    key={visitor.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {visitor.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {visitor.destination}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          visitor.status === "approved"
                            ? "default"
                            : visitor.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {visitor.status === "approved"
                          ? "Одобрен"
                          : visitor.status === "pending"
                            ? "Ожидает"
                            : "Отклонен"}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(visitor.createdAt).toLocaleDateString(
                          "ru-RU",
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Icon
                    name="Users"
                    size={48}
                    className="mx-auto mb-4 opacity-50"
                  />
                  <p>Пока нет зарегистрированных посетителей</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Building" size={20} />
              Корпуса и отделы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {buildings.length > 0 ? (
                buildings.map((building) => (
                  <div key={building.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {building.name}
                      </h4>
                      <Badge variant="outline">
                        {building.floorCount} этажей
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {building.address}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {building.departments.map((dept, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {dept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Icon
                    name="Building"
                    size={48}
                    className="mx-auto mb-4 opacity-50"
                  />
                  <p>Добавьте первый корпус</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
