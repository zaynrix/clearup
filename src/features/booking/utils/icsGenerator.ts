import type { Booking } from '../models/Booking'

/**
 * Generate .ics (iCalendar) file content for a booking
 */
export function generateICSFile(booking: Booking, adminName: string = 'ClearUP'): string {
  const startDate = booking.getFullDateTime()
  const endDate = new Date(startDate)
  endDate.setMinutes(endDate.getMinutes() + 30) // Default 30 minutes duration

  // Format date for ICS (YYYYMMDDTHHMMSSZ)
  const formatICSDate = (date: Date): string => {
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
  }

  // Escape text for ICS format
  const escapeICS = (text: string): string => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
  }

  const summary = `Meeting with ${adminName}`
  const description = booking.notes 
    ? `Meeting with ${adminName}\n\nNotes: ${booking.notes}${booking.meetingLink ? `\n\nJoin via Google Meet: ${booking.meetingLink}` : ''}`
    : `Meeting with ${adminName}${booking.meetingLink ? `\n\nJoin via Google Meet: ${booking.meetingLink}` : ''}`
  const location = booking.meetingLink || 'Online (Google Meet)'

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ClearUP//Booking System//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${booking.id || `booking-${Date.now()}@clearup.com`}
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${escapeICS(summary)}
DESCRIPTION:${escapeICS(description)}
LOCATION:${escapeICS(location)}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT30M
ACTION:DISPLAY
DESCRIPTION:Reminder: Meeting in 30 minutes
END:VALARM
END:VEVENT
END:VCALENDAR`

  return ics
}

/**
 * Download .ics file
 */
export function downloadICSFile(icsContent: string, filename: string = 'meeting.ics'): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

/**
 * Create data URL for .ics file (for email attachments)
 */
export function createICSDataURL(icsContent: string): string {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  return URL.createObjectURL(blob)
}

