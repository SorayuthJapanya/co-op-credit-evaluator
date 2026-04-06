export interface IAdmin {
  id: string;
  username: string;
  fullname: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface IEvaluateLog {
  logs_id: string;
  timestamp: string;
  username: string;
  fullname: string;
  role: string;
  action: string;
}

export interface PaginationResponse<T> {
  message: string;
  data: T;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
