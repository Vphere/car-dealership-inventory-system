import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthShowcase from '../components/AuthShowcase';
import './AuthPage.css';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ name, email, password }) => {
    setApiError('');
    try {
      await registerUser(name, email, password);
      navigate('/');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Could not create your account.');
    }
  };

  return (
    <div className="auth-screen">
      <AuthShowcase />

      <div className="auth-card-wrap">
        <div className="auth-card">
          <p className="auth-eyebrow">AutoVault &middot; New Dealer Account</p>
          <h1>Create account</h1>
          <p className="auth-subtitle">Register to browse, purchase, and manage inventory.</p>

          {apiError && <div className="auth-banner-error">{apiError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="auth-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register('name', { required: 'Enter your name.' })}
              />
              {errors.name && <p className="auth-field-error">{errors.name.message}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', { required: 'Enter your email.' })}
              />
              {errors.email && <p className="auth-field-error">{errors.email.message}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register('password', {
                  required: 'Choose a password.',
                  minLength: { value: 8, message: 'Use at least 8 characters.' },
                })}
              />
              {errors.password && <p className="auth-field-error">{errors.password.message}</p>}
            </div>

            <button className="auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
