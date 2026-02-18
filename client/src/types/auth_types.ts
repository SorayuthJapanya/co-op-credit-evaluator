export interface IUser {
  id: string;
  username: string;
  fullname: string;
}

export interface RequestUser {
  username: string;
  fullname?: string;
  password: string;
}
