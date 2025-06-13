import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(formData.username, formData.password);
      if (!success) {
        setError("Неверный логин или пароль");
      }
    } catch (err) {
      setError("Ошибка входа в систему");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={32} className="text-white" />
          </div>
          <CardTitle className="text-2xl">Бюро пропусков</CardTitle>
          <CardDescription>
            Войдите в систему управления доступом
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Введите логин"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Введите пароль"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <Icon name="AlertCircle" size={16} />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icon
                    name="Loader2"
                    size={16}
                    className="animate-spin mr-2"
                  />
                  Вход...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={16} className="mr-2" />
                  Войти
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t">
            <div className="text-sm text-gray-600 space-y-2">
              <p className="font-medium">Тестовые аккаунты:</p>
              <div className="space-y-1">
                <p>
                  <span className="font-mono bg-gray-100 px-1 rounded">
                    admin
                  </span>{" "}
                  /{" "}
                  <span className="font-mono bg-gray-100 px-1 rounded">
                    admin123
                  </span>{" "}
                  - Администратор
                </p>
                <p>
                  <span className="font-mono bg-gray-100 px-1 rounded">
                    operator
                  </span>{" "}
                  /{" "}
                  <span className="font-mono bg-gray-100 px-1 rounded">
                    pass123
                  </span>{" "}
                  - Оператор
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
