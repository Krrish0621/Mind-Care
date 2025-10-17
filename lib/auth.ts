// lib/auth.ts

const dummyCredentials = {
  admin: {
    username: "admin",
    password: "admin123",
  },
};

/**
 * Authenticates a user. This function ONLY checks for the dummy admin.
 * Student authentication is now handled by Firebase.
 */
export function authenticateUser(
  role: "admin" | "student",
  username: string,
  password: string
): boolean {
  if (role === 'admin') {
    const creds = dummyCredentials.admin;
    return username === creds.username && password === creds.password;
  }
  
  // For students, this function is no longer used.
  return false;
}