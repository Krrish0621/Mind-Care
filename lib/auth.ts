// lib/auth.ts

export const dummyCredentials = {
  admin: {
    username: "admin",
    password: "admin123",
  },
  student: {
    username: "student",
    password: "student123",
  },
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResult {
  success: boolean;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  createdAt: Date;
}

// Dummy user storage key
const USERS_KEY = 'mindcare_users';

// Get users from localStorage
const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

// Save users to localStorage
const saveUsers = (users: User[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users:', error);
  }
};

export function authenticateUser(
  role: "admin" | "student",
  username: string,
  password: string
) {
  // Check dummy credentials first
  const creds = dummyCredentials[role]
  if (username === creds.username && password === creds.password) {
    return true;
  }

  // Check registered users (only for student role)
  if (role === 'student') {
    const users = getUsers();
    const user = users.find(u => u.email === username);
    
    if (user) {
      // Get stored password for this user
      const storedPassword = localStorage.getItem(`password_${user.id}`);
      return storedPassword === password;
    }
  }

  return false;
}

export async function registerUser(data: RegisterData): Promise<RegisterResult> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validation
    if (!data.name.trim() || !data.email.trim() || !data.password.trim()) {
      return { success: false, error: 'All fields are required' };
    }

    if (!data.email.includes('@')) {
      return { success: false, error: 'Invalid email format' };
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Check if user already exists
    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      role: 'student', // New users are students by default
      createdAt: new Date()
    };

    // Save user
    users.push(newUser);
    saveUsers(users);

    // Store password separately (in real app, hash this properly)
    localStorage.setItem(`password_${newUser.id}`, data.password);
    
    // Store user info for immediate login
    localStorage.setItem('current_user', JSON.stringify(newUser));

    return { success: true };

  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

// Get current user info
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

// Logout function
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  localStorage.removeItem('current_user');
}

// Get all users (admin function)
export function getAllUsers(): User[] {
  return getUsers();
}

// Delete user (admin function)
export function deleteUser(userId: string): boolean {
  try {
    const users = getUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    saveUsers(filteredUsers);
    localStorage.removeItem(`password_${userId}`);
    return true;
  } catch {
    return false;
  }
}
