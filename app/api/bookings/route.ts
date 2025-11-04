import { type NextRequest, NextResponse } from "next/server";
import { appointments, addAppointment } from "@/lib/data-store";

// Helper function to generate a random Google Meet-style link
const generateMeetLink = () => {
  const randomChar = () => "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26));
  const code = Array.from({ length: 10 }, (_, i) => {
    if (i === 3 || i === 8) return "-";
    return randomChar();
  }).join("");
  return `https://meet.google.com/${code.slice(0,3)}-${code.slice(4,8)}-${code.slice(9)}`;
};
//
export async function POST(request: NextRequest) {
  try {
    const { student_token, counsellor_id, date, time, mode } = await request.json();

    if (!student_token || !counsellor_id || !date || !time || !mode) {
      return NextResponse.json({ error: "Missing required booking information" }, { status: 400 });
    }
    
    // Generate a meet link only if the session is online
    const meetLink = mode === "online" ? generateMeetLink() : null;

    // Manually construct the full appointment object, including a timestamp
    const newAppointmentData = {
      student_token,
      counsellor_id,
      date,
      time,
      mode,
      status: "confirmed" as const,
      meetLink,
      timestamp: new Date().toISOString(), // Add timestamp here
    };

    // The addAppointment function is expected to handle ID generation
    const booking = addAppointment(newAppointmentData);

    return NextResponse.json({
      success: true,
      booking,
      message: "Booking confirmed successfully!",
    });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const student_token = searchParams.get("student_token");

    if (!student_token) {
        return NextResponse.json({ error: "Student token is required" }, { status: 400 });
    }

    // Filter bookings by the provided student token
    const filteredBookings = appointments.filter(
      (booking) => booking.student_token === student_token
    );

    // Sort bookings by timestamp, most recent first
    const sortedBookings = filteredBookings.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ bookings: sortedBookings });
  } catch (error) {
    console.error("Bookings fetch API error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

