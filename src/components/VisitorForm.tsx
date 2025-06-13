import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useVisitors, useBuildings } from "@/hooks/useLocalStorage";
import Icon from "@/components/ui/icon";

interface VisitorFormData {
  fullName: string;
  cardNumber: string;
  destination: string;
  visitDate: string;
  visitTime: string;
  purpose: string;
}

const VisitorForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VisitorFormData>();
  const { addVisitor } = useVisitors();
  const { buildings } = useBuildings();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: VisitorFormData) => {
    setIsSubmitting(true);
    try {
      addVisitor({
        ...data,
        status: "pending",
      });

      toast({
        title: "Посетитель зарегистрирован",
        description: `${data.fullName} успешно добавлен в систему`,
      });

      reset();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось зарегистрировать посетителя",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="UserPlus" size={24} className="text-blue-600" />
          Регистрация посетителя
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">ФИО *</Label>
              <Input
                id="fullName"
                {...register("fullName", {
                  required: "ФИО обязательно для заполнения",
                })}
                placeholder="Иванов Иван Иванович"
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Номер карты *</Label>
              <Input
                id="cardNumber"
                {...register("cardNumber", {
                  required: "Номер карты обязателен",
                })}
                placeholder="12345678"
              />
              {errors.cardNumber && (
                <p className="text-sm text-red-600">
                  {errors.cardNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Куда идут *</Label>
            <Select onValueChange={(value) => setValue("destination", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите корпус/отдел" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.name}>
                    {building.name}
                  </SelectItem>
                ))}
                <SelectItem value="Главный офис">Главный офис</SelectItem>
                <SelectItem value="Производство">Производство</SelectItem>
                <SelectItem value="Склад">Склад</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visitDate">Дата визита *</Label>
              <Input
                id="visitDate"
                type="date"
                {...register("visitDate", {
                  required: "Дата визита обязательна",
                })}
              />
              {errors.visitDate && (
                <p className="text-sm text-red-600">
                  {errors.visitDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitTime">Время визита *</Label>
              <Input
                id="visitTime"
                type="time"
                {...register("visitTime", {
                  required: "Время визита обязательно",
                })}
              />
              {errors.visitTime && (
                <p className="text-sm text-red-600">
                  {errors.visitTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Цель визита</Label>
            <Textarea
              id="purpose"
              {...register("purpose")}
              placeholder="Деловая встреча, собеседование, доставка..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                Регистрация...
              </>
            ) : (
              <>
                <Icon name="Check" size={16} className="mr-2" />
                Зарегистрировать посетителя
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VisitorForm;
