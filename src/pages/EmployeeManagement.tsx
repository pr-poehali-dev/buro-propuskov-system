import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useEmployees, useBuildings } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";
import { Employee } from "@/types";

interface EmployeeFormData {
  fullName: string;
  position: string;
  department: string;
  building: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
}

const EmployeeManagement = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } =
    useEmployees();
  const { buildings } = useBuildings();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormData>();

  const onSubmit = (data: EmployeeFormData) => {
    try {
      if (editingEmployee) {
        updateEmployee(editingEmployee.id, data);
        toast({
          title: "Сотрудник обновлен",
          description: `${data.fullName} успешно обновлен`,
        });
      } else {
        addEmployee(data);
        toast({
          title: "Сотрудник добавлен",
          description: `${data.fullName} успешно добавлен в систему`,
        });
      }

      reset();
      setDialogOpen(false);
      setEditingEmployee(null);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить данные сотрудника",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setValue("fullName", employee.fullName);
    setValue("position", employee.position);
    setValue("department", employee.department);
    setValue("building", employee.building);
    setValue("phone", employee.phone);
    setValue("email", employee.email);
    setValue("status", employee.status);
    setDialogOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    if (confirm(`Удалить сотрудника ${employee.fullName}?`)) {
      deleteEmployee(employee.id);
      toast({
        title: "Сотрудник удален",
        description: `${employee.fullName} удален из системы`,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Управление сотрудниками
          </h1>
          <p className="text-gray-600 mt-1">
            Управление учетными записями сотрудников
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingEmployee(null);
                reset();
              }}
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить сотрудника
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee
                  ? "Редактировать сотрудника"
                  : "Добавить сотрудника"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">ФИО *</Label>
                  <Input
                    id="fullName"
                    {...register("fullName", { required: "ФИО обязательно" })}
                    placeholder="Иванов Иван Иванович"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Должность *</Label>
                  <Input
                    id="position"
                    {...register("position", {
                      required: "Должность обязательна",
                    })}
                    placeholder="Менеджер"
                  />
                  {errors.position && (
                    <p className="text-sm text-red-600">
                      {errors.position.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Отдел *</Label>
                  <Input
                    id="department"
                    {...register("department", {
                      required: "Отдел обязателен",
                    })}
                    placeholder="IT-отдел"
                  />
                  {errors.department && (
                    <p className="text-sm text-red-600">
                      {errors.department.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="building">Корпус</Label>
                  <Select
                    onValueChange={(value) => setValue("building", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите корпус" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((building) => (
                        <SelectItem key={building.id} value={building.name}>
                          {building.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="Главный офис">Главный офис</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="ivanov@company.ru"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <Select
                  onValueChange={(value: "active" | "inactive") =>
                    setValue("status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активный</SelectItem>
                    <SelectItem value="inactive">Неактивный</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  <Icon name="Save" size={16} className="mr-2" />
                  {editingEmployee ? "Обновить" : "Добавить"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingEmployee(null);
                  }}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Сотрудники ({employees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.length > 0 ? (
              employees.map((employee) => (
                <div key={employee.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">
                          {employee.fullName}
                        </h4>
                        <Badge
                          variant={
                            employee.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {employee.status === "active"
                            ? "Активный"
                            : "Неактивный"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Должность:</span>
                          <p>{employee.position}</p>
                        </div>
                        <div>
                          <span className="font-medium">Отдел:</span>
                          <p>{employee.department}</p>
                        </div>
                        <div>
                          <span className="font-medium">Корпус:</span>
                          <p>{employee.building || "Не указан"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Телефон:</span>
                          <p>{employee.phone || "Не указан"}</p>
                        </div>
                      </div>

                      {employee.email && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Email:</span>{" "}
                          {employee.email}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(employee)}
                      >
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(employee)}
                      >
                        <Icon name="Trash" size={14} />
                      </Button>
                    </div>
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
                <p>Добавьте первого сотрудника</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
