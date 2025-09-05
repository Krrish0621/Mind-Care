import { type NextRequest, NextResponse } from "next/server"
import { appointments, addAppointment } from "@/lib/data-store"

export async function POST(request: NextRequest) {
  try {
    const { student_token, counsellor_id, date, time, mode } = await request.json()

    const booking = addAppointment({
      student_token,
      counsellor_id,
      date,
      time,
      mode,
      status: "confirmed",
    })

    return NextResponse.json({
      success: true,
      booking,
      message: "Booking confirmed successfully!",
    })
  } catch (error) {
    console.error("Booking API error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const student_token = searchParams.get("student_token")

    const filteredBookings = student_token
      ? appointments.filter((booking) => booking.student_token === student_token)
      : appointments

    const sortedBookings = filteredBookings.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    return NextResponse.json({ bookings: sortedBookings })
  } catch (error) {
    console.error("Bookings fetch API error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
