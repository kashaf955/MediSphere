import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import DoctorLayout from './DoctorLayout'

const periods = [
  { id: 'weekly', label: 'This week' },
  { id: 'monthly', label: 'This month' },
]

const DoctorReports = () => {
  const { dToken, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [period, setPeriod] = useState('weekly')
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!dToken) {
      navigate('/doctor')
      return
    }
    let cancelled = false
    const load = async () => {
      setReport(null)
      setError('')
      try {
        const { data } = await axios.get(`${backendUrl}/api/doctor/report`, { headers: { dtoken: dToken }, params: { period } })
        if (cancelled) return
        if (data.success) setReport(data.report)
        else setError(data.message)
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Unable to load report')
      }
    }
    load()
    return () => { cancelled = true }
  }, [dToken, backendUrl, navigate, period])

  const cards = report ? [
    { label: 'Booked', value: report.booked },
    { label: 'Completed', value: report.completed },
    { label: 'Cancelled', value: report.cancelled },
    { label: 'Upcoming', value: report.upcoming },
    { label: 'Patients', value: report.patients },
    { label: 'Earnings', value: `$${report.earnings}` },
  ] : []

  return (
    <DoctorLayout>
      <p className='text-3xl tracking-tight text-slate-900'>Reports</p>
      <p className='mt-1 text-sm text-slate-500'>A summary of your visits for this week or this month.</p>
      <div className='mt-6 flex gap-2'>
        {periods.map((item) => (
          <button key={item.id} type='button' onClick={() => setPeriod(item.id)} className={`rounded-full px-5 py-2 text-sm transition ${period === item.id ? 'bg-primary text-white shadow-md shadow-primary/25' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>
            {item.label}
          </button>
        ))}
      </div>
      {error && <p className='mt-4 text-sm text-red-500'>{error}</p>}
      {!report && !error && <p className='mt-8 text-sm text-slate-500'>Preparing report...</p>}
      {report && (
        <>
          <div className='mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(26,29,46,0.45)]'>
            <p className='text-sm leading-6 text-slate-700'>{report.summary}</p>
          </div>
          <div className='mt-6 grid gap-4 sm:grid-cols-3'>
            {cards.map((card) => (
              <div key={card.label} className='rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(26,29,46,0.45)]'>
                <p className='text-xs tracking-[0.16em] text-slate-400'>{card.label.toUpperCase()}</p>
                <p className='mt-3 text-3xl tracking-tight text-slate-900'>{card.value}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </DoctorLayout>
  )
}

export default DoctorReports
