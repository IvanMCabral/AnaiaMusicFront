export interface UserResponse {
  message: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}
