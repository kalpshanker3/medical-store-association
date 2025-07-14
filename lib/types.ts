export interface AppState {
  user: any;
  isLoggedIn: boolean;
  setUser: (user: any) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setCurrentPage: (page: string) => void;
} 