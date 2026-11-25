export const slotLabel = (appointment) => {
  const date = (appointment.slotDate || '').replaceAll('_', ' ')
  return [date, appointment.slotTime].filter(Boolean).join(' · ')
}

export const statusOf = (appointment) => {
  if (appointment.cancelled) return 'Cancelled'
  if (appointment.isCompleted) return 'Completed'
  return 'Upcoming'
}

export const statusClass = (status) => {
  if (status === 'Cancelled') return 'bg-red-50 text-red-600'
  if (status === 'Completed') return 'bg-emerald-50 text-emerald-600'
  return 'bg-indigo-50 text-primary'
}
