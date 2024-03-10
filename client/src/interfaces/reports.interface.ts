export interface ITutorReport {
  _id: string;
  type: "weekly" | "monthly" | "yearly";
  tutor: string;
  enrollmentsCount: number;
  enrollmentsByCourse: {
    name: string;
    count: number;
  }[];
  averageRating: number;
  revenue: number;
  earnings: number;
  startDate: Date;
  endDate: Date;
}

export interface IAdminReport {
  _id: string;
  usersCount: number;
  enrollmentsByCategory: {
    name: string;
    count: number;
  }[];
  type: "weekly" | "monthly" | "yearly";
  tutor: string;
  enrollmentsCount: number;
  enrollmentsByCourse: {
    name: string;
    count: number;
  }[];
  averageRating: number;
  revenue: number;
  earnings: number;
  startDate: Date;
  endDate: Date;
}
