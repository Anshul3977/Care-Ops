export const mockBookingData = [
  { date: 'Mon', completed: 12, confirmed: 8, noshow: 2 },
  { date: 'Tue', completed: 14, confirmed: 10, noshow: 1 },
  { date: 'Wed', completed: 10, confirmed: 12, noshow: 3 },
  { date: 'Thu', completed: 16, confirmed: 14, noshow: 2 },
  { date: 'Fri', completed: 18, confirmed: 16, noshow: 1 },
  { date: 'Sat', completed: 20, confirmed: 18, noshow: 2 },
  { date: 'Sun', completed: 8, confirmed: 6, noshow: 1 },
]

export const mockLeadSourceData = [
  { name: 'Contact Form', value: 45, fill: 'hsl(217, 91%, 59.8%)' },
  { name: 'Direct Booking', value: 35, fill: 'hsl(173, 58%, 39%)' },
  { name: 'Referral', value: 15, fill: 'hsl(197, 37%, 24%)' },
  { name: 'Social Media', value: 5, fill: 'hsl(27, 87%, 67%)' },
]

export const mockTodayBookings = [
  { time: '9:00 AM', customer: 'Sarah Johnson' },
  { time: '11:30 AM', customer: 'Michael Chen' },
  { time: '2:15 PM', customer: 'Emily Rodriguez' },
]

export const mockLeads = [
  { name: 'John Smith', timestamp: '2 hours ago' },
  { name: 'Lisa Anderson', timestamp: '4 hours ago' },
  { name: 'David Kim', timestamp: '1 day ago' },
]

export const mockPendingForms = [
  { type: 'Post-Service Feedback', count: 5 },
  { type: 'Payment Form', count: 2 },
  { type: 'Next Appointment', count: 8 },
]

export const mockInventoryAlerts = [
  { item: 'Premium Cleaning Solution', status: 'critical' },
  { item: 'Microfiber Cloths', status: 'low' },
  { item: 'Vacuum Bags', status: 'critical' },
]

export const mockAlertCounts = {
  unreadMessages: 3,
  unconfirmedBookings: 7,
  overdueForms: 5,
  criticalInventory: 2,
}
