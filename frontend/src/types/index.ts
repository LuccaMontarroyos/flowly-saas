export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }
  
  export interface Project {
    id: string;
    name: string;
    description: string | null;
    taskCount: number;
    ownerId: string;
    companyId: string;
    createdAt: string;
  }