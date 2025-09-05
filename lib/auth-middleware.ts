import { type NextRequest, NextResponse } from "next/server"
import { verifyFirebaseToken, validateAdminToken, validateCounsellorToken } from "./database"

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  requiredRole?: "admin" | "counsellor",
) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    // For admin/counsellor routes, verify Firebase token
    if (requiredRole) {
      const decodedToken = await verifyFirebaseToken(token)
      if (!decodedToken) {
        return NextResponse.json({ error: "Invalid Firebase token" }, { status: 401 })
      }

      // Additional role validation
      if (requiredRole === "admin") {
        const isAdmin = await validateAdminToken(token)
        if (!isAdmin) {
          return NextResponse.json({ error: "Admin access required" }, { status: 403 })
        }
      } else if (requiredRole === "counsellor") {
        const isCounsellor = await validateCounsellorToken(token)
        if (!isCounsellor) {
          return NextResponse.json({ error: "Counsellor access required" }, { status: 403 })
        }
      }
    }
    // Add user info to request
    ;(request as any).user = { token, role: requiredRole }

    return await handler(request)
  } catch (error) {
    console.error("[v0] Auth middleware error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

export function requireAuth(requiredRole?: "admin" | "counsellor") {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return (request: NextRequest) => withAuth(request, handler, requiredRole)
  }
}
