
export interface ErrorHandler extends Error {
  status?: number;
}

export interface ValidationErrorItem {
  message: string;
  type: string;
  path: string;
  value: unknown; 
}

export interface SequelizeBaseError {
  name: string;
  message?: string;
  errors?: ValidationErrorItem[];
  sql?: string;
  parent?: SequelizeBaseError & {
    sql: string;
    error?: string;
  };
}

