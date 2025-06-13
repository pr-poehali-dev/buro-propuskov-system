export interface Visitor {
  id: string;
  fullName: string;
  cardNumber: string;
  destination: string;
  visitDate: string;
  visitTime: string;
  purpose: string;
  status: "pending" | "approved" | "denied" | "completed";
  createdAt: string;
}

export interface Employee {
  id: string;
  fullName: string;
  position: string;
  department: string;
  building: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  description: string;
  floorCount: number;
  departments: string[];
  createdAt: string;
}

export interface VisitLog {
  id: string;
  visitorId: string;
  employeeId?: string;
  buildingId: string;
  checkInTime: string;
  checkOutTime?: string;
  status: "checked-in" | "checked-out";
}
