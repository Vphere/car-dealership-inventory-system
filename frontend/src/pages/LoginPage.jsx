import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthShowcase from '../components/AuthShowcase';
import './AuthPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    setApiError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Could not sign in. Check your email and password.');
    }
  };

  return (
    <div className="auth-screen">
      <AuthShowcase />

      <div className="auth-card-wrap">
        <div className="auth-card">
          <p className="auth-eyebrow">AutoVault &middot; Dealer Access</p>
          <h1>Sign in</h1>
          <p className="auth-subtitle">Enter your credentials to view the floor.</p>

          {apiError && <div className="auth-banner-error">{apiError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                autoComplete="current-password"
                {...register('password', { required: 'Enter your password.' })}
              />
              {errors.password && <p className="auth-field-error">{errors.password.message}</p>}
            </div>

            <button className="auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">
            New to the AutoVault? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
