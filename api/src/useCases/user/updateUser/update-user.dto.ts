export interface UpdateUserDto {
  id: string;
  data: {
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    isVerified: boolean;
  };
}
