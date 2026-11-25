import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import { specialityData, assets } from '../../assets/assets'
import AdminLayout from './AdminLayout'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  specialization: 'General physician',
  degree: '',
  experience: '',
  fees: '',
  about: '',
  address: '',
  available: true,
}

const AddDoctor = () => {
  const { aToken, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!aToken) navigate('/admin')
  }, [aToken, navigate])

  const setField = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    if (!image) {
      setError('A profile image is required')
      return
    }
    setSaving(true)
    try {
      const body = new FormData()
      Object.entries(form).forEach(([key, value]) => body.append(key, value))
      body.append('image', image)
      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, body, { headers: { atoken: aToken } })
      if (data.success) {
        setMessage(data.message)
        setForm(emptyForm)
        setImage(null)
        setPreview('')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add doctor')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <p className='text-3xl tracking-tight text-slate-900'>Add doctor</p>
      <p className='mt-1 text-sm text-slate-500'>Password needs 8+ characters with upper, lower, number, and symbol.</p>
      <form onSubmit={onSubmit} className='mt-6 grid max-w-3xl gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_40px_-28px_rgba(26,29,46,0.45)] sm:grid-cols-2 sm:p-6'>
        <label className='flex cursor-pointer items-center gap-3 sm:col-span-2'>
          <img src={preview || assets.upload_icon} alt='' className='h-16 w-16 rounded-2xl bg-[#eef1ff] object-cover' />
          <span className='text-sm text-slate-500'>Upload profile image</span>
          <input type='file' accept='image/*' hidden onChange={(e) => {
            const file = e.target.files?.[0] || null
            setImage(file)
            setPreview(file ? URL.createObjectURL(file) : '')
          }} />
        </label>
        <div>
          <p className='text-xs tracking-wide text-slate-500'>Name</p>
          <input className='field' value={form.name} onChange={setField('name')} required />
        </div>
        <div>
          <p className='text-xs tracking-wide text-slate-500'>Email</p>
          <input className='field' type='email' value={form.email} onChange={setField('email')} required />
        </div>
        <div>
          <p className='text-xs tracking-wide text-slate-500'>Password</p>
          <input className='field' type='password' value={form.password} onChange={setField('password')} required />
        </div>
        <div>
          <p className='text-xs tracking-wide text-slate-500'>Speciality</p>
          <select className='field' value={form.specialization} onChange={setField('specialization')}>
            {specialityData.map((item) => <option key={item.speciality} value={item.speciality}>{item.speciality}</option>)}
          </select>
        </div>
        <div>
          <p className='text-xs tracking-wide text-slate-500'>Degree</p>
          <input className='field' value={form.degree} onChange={setField('degree')} required />
        </div>
        <div>
          <p className='text-xs tracking-wide text-slate-500'>Experience (years)</p>
          <input className='field' type='number' min='0' value={form.experience} onChange={setField('experience')} required />
        </div>
        <div>
          <p className='text-xs tracking-wide text-slate-500'>Fees</p>
          <input className='field' type='number' min='0' value={form.fees} onChange={setField('fees')} required />
        </div>
        <div>
          <p className='text-xs tracking-wide text-slate-500'>Address</p>
          <input className='field' value={form.address} onChange={setField('address')} required />
        </div>
        <div className='sm:col-span-2'>
          <p className='text-xs tracking-wide text-slate-500'>About</p>
          <textarea className='field min-h-28' value={form.about} onChange={setField('about')} required />
        </div>
        <label className='flex items-center gap-2 text-sm text-slate-700 sm:col-span-2'>
          <input type='checkbox' checked={form.available} onChange={setField('available')} />
          Available for appointments
        </label>
        {error && <p className='text-sm text-red-500 sm:col-span-2'>{error}</p>}
        {message && <p className='text-sm text-emerald-600 sm:col-span-2'>{message}</p>}
        <button type='submit' disabled={saving} className='rounded-full bg-primary py-3 text-white shadow-lg shadow-primary/30 disabled:opacity-60 sm:col-span-2'>
          {saving ? 'Saving...' : 'Add doctor'}
        </button>
      </form>
    </AdminLayout>
  )
}

export default AddDoctor
