import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useBuildings } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";
import { Building } from "@/types";

interface BuildingFormData {
  name: string;
  address: string;
  description: string;
  floorCount: number;
  departments: string;
}

const BuildingManagement = () => {
  const { buildings, addBuilding, updateBuilding, deleteBuilding } =
    useBuildings();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BuildingFormData>();

  const onSubmit = (data: BuildingFormData) => {
    try {
      const departmentsArray = data.departments
        .split(",")
        .map((dept) => dept.trim())
        .filter((dept) => dept.length > 0);

      const buildingData = {
        ...data,
        floorCount: Number(data.floorCount),
        departments: departmentsArray,
      };

      if (editingBuilding) {
        updateBuilding(editingBuilding.id, buildingData);
        toast({
          title: "Корпус обновлен",
          description: `${data.name} успешно обновлен`,
        });
      } else {
        addBuilding(buildingData);
        toast({
          title: "Корпус добавлен",
          description: `${data.name} успешно добавлен в систему`,
        });
      }

      reset();
      setDialogOpen(false);
      setEditingBuilding(null);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить данные корпуса",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (building: Building) => {
    setEditingBuilding(building);
    setValue("name", building.name);
    setValue("address", building.address);
    setValue("description", building.description);
    setValue("floorCount", building.floorCount);
    setValue("departments", building.departments.join(", "));
    setDialogOpen(true);
  };

  const handleDelete = (building: Building) => {
    if (confirm(`Удалить корпус ${building.name}?`)) {
      deleteBuilding(building.id);
      toast({
        title: "Корпус удален",
        description: `${building.name} удален из системы`,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Управление корпусами
          </h1>
          <p className="text-gray-600 mt-1">Управление зданиями и отделами</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingBuilding(null);
                reset();
              }}
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить корпус
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBuilding ? "Редактировать корпус" : "Добавить корпус"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название корпуса *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Название обязательно" })}
                  placeholder="Главный корпус"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Адрес *</Label>
                <Input
                  id="address"
                  {...register("address", { required: "Адрес обязателен" })}
                  placeholder="ул. Примерная, д. 1"
                />
                {errors.address && (
                  <p className="text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="floorCount">Количество этажей *</Label>
                <Input
                  id="floorCount"
                  type="number"
                  min="1"
                  {...register("floorCount", {
                    required: "Количество этажей обязательно",
                    min: { value: 1, message: "Минимум 1 этаж" },
                  })}
                  placeholder="5"
                />
                {errors.floorCount && (
                  <p className="text-sm text-red-600">
                    {errors.floorCount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="departments">Отделы (через запятую)</Label>
                <Input
                  id="departments"
                  {...register("departments")}
                  placeholder="IT-отдел, Бухгалтерия, HR"
                />
                <p className="text-xs text-gray-500">
                  Укажите названия отделов через запятую
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Дополнительная информация о корпусе..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  <Icon name="Save" size={16} className="mr-2" />
                  {editingBuilding ? "Обновить" : "Добавить"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingBuilding(null);
                  }}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildings.length > 0 ? (
          buildings.map((building) => (
            <Card
              key={building.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Icon name="Building" size={20} className="text-blue-600" />
                    {building.name}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(building)}
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(building)}
                    >
                      <Icon name="Trash" size={14} />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    <Icon name="MapPin" size={14} className="inline mr-1" />
                    {building.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    <Icon name="Layers" size={14} className="inline mr-1" />
                    {building.floorCount} этажей
                  </p>
                </div>

                {building.description && (
                  <p className="text-sm text-gray-700">
                    {building.description}
                  </p>
                )}

                {building.departments.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Отделы:
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
                )}

                <div className="text-xs text-gray-500 pt-2 border-t">
                  Создан:{" "}
                  {new Date(building.createdAt).toLocaleDateString("ru-RU")}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-8">
                <Icon
                  name="Building"
                  size={48}
                  className="mx-auto mb-4 opacity-50 text-gray-400"
                />
                <p className="text-gray-500 mb-4">
                  Пока нет добавленных корпусов
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить первый корпус
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingManagement;
