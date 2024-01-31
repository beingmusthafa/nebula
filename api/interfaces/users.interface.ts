export default interface UsersInterface {
  name: string;
  email: string;
  password: string;
  image?: string;
  role?: "user" | "admin" | "moderator";
  isBlocked?: boolean;
  appointmentCost?: number;
  interests?: string[];
}
