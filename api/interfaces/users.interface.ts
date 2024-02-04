export default interface UsersInterface {
  name: string;
  email: string;
  password: string;
  bio?: string;
  image?: string;
  role?: "user" | "admin" | "moderator";
  education?: object[];
  experience?: object[];
  isBlocked?: boolean;
  appointmentCost?: number;
  interests?: string[];
  isAuthExternal: boolean;
}
