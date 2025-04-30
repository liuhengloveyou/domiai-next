import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      cellphone?: string | null;
      image?: string | null;
      role?: string | null;
      status?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    cellphone?: string | null;
    image?: string | null;
    role?: string | null;
    status?: string | null;
  }
} 