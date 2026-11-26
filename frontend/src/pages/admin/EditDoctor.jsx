import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import { specialityData, assets } from '../../assets/assets'
import AdminLayout from './AdminLayout'

const EditDoctor = () => {
  const { docId } = useParams()
  const { aToken, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!aToken) {
      navigate('/admin')
      return
    }
    const load = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/doctors`, { headers: { atoken: aToken } })
        const doctor = data.doctors?.find((item) => item._id === docId)
        if (!doctor) {
          setError('Doctor not found')
          return
        }
        setForm({
          name: doctor.name,
          email: doctor.email,
          password: '',
          specialization: doctor.specialization,
          degree: doctor.degree,
          experience: doctor.experience,
          fees: doctor.fees,
          about: doctor.about,
          address: typeof doctor.address === 'string' ? doctor.address : '',
          available: Boolean(doctor.available),
          image: doctor.image,
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load doctor')
      }
    }
    load()
  }, [aToken, backendUrl, docId, navigate])

  const setField = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setSaving(true)
    try {
      const body = new FormData()
      body.append('docId', docId)
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'image' && key !== 'password') body.append(key, value)
      })
      if (form.password) body.append('password', form.password)
      if (image) body.append('image', image)
      const { data } = await axios.post(`${backendUrl}/api/admin/update-doctor`, body, { headers: { atoken: aToken } })
      if (data.success) setMessage(data.message)
      else setError(data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update doctor')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <p className='text-3xl tracking-tight text-slate-900'>Edit doctor</p>
      <p className='mt-1 text-sm text-slate-500'>Leave the password blank to keep the current dashboard login.</p>
      {error && !form && <p className='mt-4 text-sm text-red-500'>{error}</p>}
      {!form && !error && <p className='mt-8 text-sm text-slate-500'>Loading doctor...</p>}
      {form && (
        <form onSubmit={onSubmit} className='mt-6 grid max-w-3xl gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_40px_-28px_rgba(26,29,46,0.45)] sm:grid-cols-2 sm:p-6'>
          <label className='flex cursor-pointer items-center gap-3 sm:col-span-2'>
            <img src={preview || form.image || assets.upload_icon} alt='' className='h-16 w-16 rounded-2xl bg-[#eef1ff] object-cover' />
            <span className='text-sm text-slate-500'>Replace profile image</span>
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
            <p className='text-xs tracking-wide text-slate-500'>New password</p>
            <input className='field' type='password' value={form.password} onChange={setField('password')} placeholder='Optional' />
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
          <div className='flex gap-3 sm:col-span-2'>
            <button type='submit' disabled={saving} className='rounded-full bg-primary px-8 py-3 text-white shadow-lg shadow-primary/30 disabled:opacity-60'>{saving ? 'Saving...' : 'Update doctor'}</button>
            <button type='button' onClick={() => navigate('/admin/doctors')} className='rounded-full border border-slate-200 px-8 py-3 text-slate-600'>Back</button>
          </div>
        </form>
      )}
    </AdminLayout>
  )
}

export default EditDoctor
