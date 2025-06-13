import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useOperators } from "@/hooks/useLocalStorage";
import { Operator } from "@/types";

const OperatorManagement = () => {
  const { operators, addOperator, updateOperator, deleteOperator } =
    useOperators();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "operator" as "admin" | "operator",
    permissions: [] as string[],
    shift: "morning" as "morning" | "evening" | "night",
    status: "active" as "active" | "inactive",
  });

  const availablePermissions = [
    "view_visitors",
    "manage_visitors",
    "view_employees",
    "manage_employees",
    "view_buildings",
    "manage_buildings",
    "view_reports",
    "system_settings",
  ];

  const resetForm = () => {
    setFormData({
      fullName: "",
      username: "",
      password: "",
      role: "operator",
      permissions: [],
      shift: "morning",
      status: "active",
    });
    setEditingOperator(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingOperator) {
      updateOperator(editingOperator.id, formData);
    } else {
      addOperator(formData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (operator: Operator) => {
    setEditingOperator(operator);
    setFormData({
      fullName: operator.fullName,
      username: operator.username,
      password: operator.password,
      role: operator.role,
      permissions: operator.permissions,
      shift: operator.shift,
      status: operator.status,
    });
    setIsDialogOpen(true);
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter((p) => p !== permission),
    }));
  };

  const getShiftBadge = (shift: string) => {
    const colors = {
      morning: "bg-green-100 text-green-800",
      evening: "bg-orange-100 text-orange-800",
      night: "bg-blue-100 text-blue-800",
    };
    return colors[shift as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getRoleBadge = (role: string) => {
    return role === "admin"
      ? "bg-purple-100 text-purple-800"
      : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Управление операторами
          </h1>
          <p className="text-gray-600">Управление пользователями системы</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить оператора
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOperator
                  ? "Редактировать оператора"
                  : "Добавить оператора"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">ФИО</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Роль</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "admin" | "operator") =>
                      setFormData((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operator">Оператор</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="shift">Смена</Label>
                  <Select
                    value={formData.shift}
                    onValueChange={(value: "morning" | "evening" | "night") =>
                      setFormData((prev) => ({ ...prev, shift: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Утренняя</SelectItem>
                      <SelectItem value="evening">Вечерняя</SelectItem>
                      <SelectItem value="night">Ночная</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Разрешения</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {availablePermissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={permission}
                        checked={formData.permissions.includes(permission)}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(permission, checked as boolean)
                        }
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={formData.status === "active"}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: checked ? "active" : "inactive",
                    }))
                  }
                />
                <Label htmlFor="status">Активный статус</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button type="submit">
                  {editingOperator ? "Сохранить" : "Добавить"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ФИО</TableHead>
              <TableHead>Логин</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Смена</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Разрешения</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operators.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  Операторы не найдены
                </TableCell>
              </TableRow>
            ) : (
              operators.map((operator) => (
                <TableRow key={operator.id}>
                  <TableCell className="font-medium">
                    {operator.fullName}
                  </TableCell>
                  <TableCell>{operator.username}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadge(operator.role)}>
                      {operator.role === "admin" ? "Администратор" : "Оператор"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getShiftBadge(operator.shift)}>
                      {operator.shift === "morning"
                        ? "Утренняя"
                        : operator.shift === "evening"
                          ? "Вечерняя"
                          : "Ночная"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        operator.status === "active" ? "default" : "secondary"
                      }
                    >
                      {operator.status === "active" ? "Активный" : "Неактивный"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {operator.permissions.length} разрешений
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(operator)}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteOperator(operator.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OperatorManagement;
