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

export function authenticateUser(
  role: "admin" | "student",
  username: string,
  password: string
) {
  const creds = dummyCredentials[role]
  return username === creds.username && password === creds.password
}
