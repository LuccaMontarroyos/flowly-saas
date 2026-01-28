export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string; // Opcional por enquanto
  }
  
  export interface Project {
    id: string;
    name: string;
    description: string | null;
    taskCount: number;
    ownerId: string;
    createdAt: string;
  }