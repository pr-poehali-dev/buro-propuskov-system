import VisitorForm from "@/components/VisitorForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVisitors } from "@/hooks/useLocalStorage";
import Icon from "@/components/ui/icon";

const VisitorRegistration = () => {
  const { visitors, updateVisitor } = useVisitors();

  const handleStatusChange = (
    visitorId: string,
    status: "approved" | "denied",
  ) => {
    updateVisitor(visitorId, { status });
  };

  const pendingVisitors = visitors.filter((v) => v.status === "pending");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Регистрация посетителей
        </h1>
        <p className="text-gray-600 mt-1">
          Регистрация новых посетителей и управление заявками
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <VisitorForm />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Clock" size={20} />
                Ожидают одобрения ({pendingVisitors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingVisitors.length > 0 ? (
                  pendingVisitors.map((visitor) => (
                    <div
                      key={visitor.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {visitor.fullName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Карта: {visitor.cardNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            Направление: {visitor.destination}
                          </p>
                        </div>
                        <Badge variant="secondary">Ожидает</Badge>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p>
                          📅{" "}
                          {new Date(visitor.visitDate).toLocaleDateString(
                            "ru-RU",
                          )}
                        </p>
                        <p>🕐 {visitor.visitTime}</p>
                        {visitor.purpose && <p>📝 {visitor.purpose}</p>}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(visitor.id, "approved")
                          }
                          className="flex-1"
                        >
                          <Icon name="Check" size={14} className="mr-1" />
                          Одобрить
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(visitor.id, "denied")
                          }
                          className="flex-1"
                        >
                          <Icon name="X" size={14} className="mr-1" />
                          Отклонить
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Icon
                      name="CheckCircle"
                      size={48}
                      className="mx-auto mb-4 opacity-50"
                    />
                    <p>Нет заявок на рассмотрение</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisitorRegistration;
