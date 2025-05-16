export type User = {
  id: number;
  first_name: string;
  last_name: string;
  city: string;
  gender: string;
  age: number;
  hobbies: string[];
  avatar_url: string;
  lifestyle_preferences: string[];
  location: string;
  preferences: Record<string, unknown>;
};

export type UsersList = User[];
