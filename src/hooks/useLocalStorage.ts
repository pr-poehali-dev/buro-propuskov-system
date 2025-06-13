import { useState, useEffect } from "react";
import { Visitor, Employee, Building } from "@/types";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useVisitors() {
  const [visitors, setVisitors] = useLocalStorage<Visitor[]>("visitors", []);

  const addVisitor = (visitor: Omit<Visitor, "id" | "createdAt">) => {
    const newVisitor: Visitor = {
      ...visitor,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setVisitors((prev) => [...prev, newVisitor]);
    return newVisitor;
  };

  const updateVisitor = (id: string, updates: Partial<Visitor>) => {
    setVisitors((prev) =>
      prev.map((visitor) =>
        visitor.id === id ? { ...visitor, ...updates } : visitor,
      ),
    );
  };

  const deleteVisitor = (id: string) => {
    setVisitors((prev) => prev.filter((visitor) => visitor.id !== id));
  };

  return { visitors, addVisitor, updateVisitor, deleteVisitor };
}

export function useEmployees() {
  const [employees, setEmployees] = useLocalStorage<Employee[]>(
    "employees",
    [],
  );

  const addEmployee = (employee: Omit<Employee, "id" | "createdAt">) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setEmployees((prev) => [...prev, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === id ? { ...employee, ...updates } : employee,
      ),
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((employee) => employee.id !== id));
  };

  return { employees, addEmployee, updateEmployee, deleteEmployee };
}

export function useBuildings() {
  const [buildings, setBuildings] = useLocalStorage<Building[]>(
    "buildings",
    [],
  );

  const addBuilding = (building: Omit<Building, "id" | "createdAt">) => {
    const newBuilding: Building = {
      ...building,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setBuildings((prev) => [...prev, newBuilding]);
    return newBuilding;
  };

  const updateBuilding = (id: string, updates: Partial<Building>) => {
    setBuildings((prev) =>
      prev.map((building) =>
        building.id === id ? { ...building, ...updates } : building,
      ),
    );
  };

  const deleteBuilding = (id: string) => {
    setBuildings((prev) => prev.filter((building) => building.id !== id));
  };

  return { buildings, addBuilding, updateBuilding, deleteBuilding };
}
