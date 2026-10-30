import React, { useState } from 'react'

const Login = () => {
  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <form onSubmit={onSubmit} className='flex min-h-[80vh] items-center py-10'>
      <div className='m-auto flex w-full max-w-md flex-col items-start gap-3 rounded-3xl border border-slate-200/80 bg-white p-8 text-sm text-slate-600 shadow-[0_24px_60px_-32px_rgba(26,29,46,0.45)] sm:p-10'>
        <p className='text-3xl tracking-tight text-slate-900'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p className='mb-2 text-slate-500'>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment</p>
        {state === 'Sign Up' && (
          <div className='w-full'>
            <p className='text-xs tracking-wide text-slate-500'>Full Name</p>
            <input className='field' type='text' onChange={(e) => setName(e.target.value)} value={name} required />
          </div>
        )}
        <div className='w-full'>
          <p className='text-xs tracking-wide text-slate-500'>Email</p>
          <input className='field' type='email' onChange={(e) => setEmail(e.target.value)} value={email} required />
        </div>
        <div className='w-full'>
          <p className='text-xs tracking-wide text-slate-500'>Password</p>
          <input className='field' type='password' onChange={(e) => setPassword(e.target.value)} value={password} required />
        </div>
        <button type='submit' className='mt-3 w-full rounded-full bg-primary py-3 text-base text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</button>
        {state === 'Sign Up'
          ? <p className='pt-1'>Already have an account? <span onClick={() => setState('Login')} className='cursor-pointer text-primary'>Login here</span></p>
          : <p className='pt-1'>Create a new account? <span onClick={() => setState('Sign Up')} className='cursor-pointer text-primary'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login
