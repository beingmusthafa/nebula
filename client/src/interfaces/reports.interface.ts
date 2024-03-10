export default interface IReport {
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
