import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import {
  Mail,
  KeyRound,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  AlertCircle,
  Loader,
} from 'lucide-react';

type ResetStep = 'email' | 'otp' | 'newPassword' | 'success';

export const ForgotPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const initialOtp = searchParams.get('otp') || searchParams.get('token') || '';

  const { forgotPassword, verifyResetOtp, resetPassword, isAuthLoading } = useStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<ResetStep>(initialOtp && initialEmail ? 'newPassword' : 'email');
  const [email, setEmail] = useState(initialEmail);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [verifiedToken, setVerifiedToken] = useState<string>(initialOtp || '');
  
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(0);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle Step 1: Send OTP
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address');
      return;
    }

    setErrorMessage(null);
    const res = await forgotPassword(email.trim());
    if (res.success) {
      if (res.otp) {
        setDevOtp(res.otp);
      }
      setStep('otp');
      setResendTimer(60);
      // Auto-focus first OTP input on next tick
      setTimeout(() => otpInputsRef.current[0]?.focus(), 150);
    } else {
      setErrorMessage(res.message || 'No account found with this email.');
    }
  };

  // Handle Step 2: OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setErrorMessage(null);

    // Auto-advance to next box
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      setOtpDigits(digits);
      otpInputsRef.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code');
      return;
    }

    setErrorMessage(null);
    const res = await verifyResetOtp(email.trim(), fullOtp);
    if (res.success) {
      setVerifiedToken(res.resetToken || fullOtp);
      setStep('newPassword');
    } else {
      setErrorMessage(res.message || 'Invalid or expired code. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setErrorMessage(null);
    const res = await forgotPassword(email.trim());
    if (res.success) {
      if (res.otp) setDevOtp(res.otp);
      setResendTimer(60);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    if (devOtp && devOtp.length === 6) {
      setOtpDigits(devOtp.split(''));
      otpInputsRef.current[5]?.focus();
    }
  };

  // Handle Step 3: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordValue || newPasswordValue.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    if (newPasswordValue !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setErrorMessage(null);
    const key = verifiedToken || otpDigits.join('');
    const success = await resetPassword(email.trim(), key, newPasswordValue);
    if (success) {
      setStep('success');
    } else {
      setErrorMessage('Failed to reset password. The code may have expired.');
    }
  };

  return (
    <div style={{ padding: 'clamp(2.5rem, 5vw, 5rem) 0 clamp(3rem, 6vw, 6rem) 0', backgroundColor: '#FAF7F2', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: 'clamp(1.5rem, 4.5vw, 2.75rem)',
            border: '1px solid #E7E5E4',
            boxShadow: '0 12px 36px rgba(0,0,0,0.05)',
          }}
        >
          {/* Header Icon */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #FEF3C7 0%, #F59E0B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                boxShadow: '0 8px 18px rgba(245, 158, 11, 0.25)',
              }}
            >
              {step === 'success' ? (
                <CheckCircle size={30} color="#78350F" />
              ) : step === 'newPassword' ? (
                <Lock size={28} color="#78350F" />
              ) : step === 'otp' ? (
                <KeyRound size={28} color="#78350F" />
              ) : (
                <Mail size={28} color="#78350F" />
              )}
            </div>

            <h2 style={{ fontSize: '1.65rem', color: '#1C1917', marginBottom: '0.35rem', fontWeight: 800 }}>
              {step === 'email' && 'Forgot Password?'}
              {step === 'otp' && 'Verify Code'}
              {step === 'newPassword' && 'Create New Password'}
              {step === 'success' && 'Password Reset Complete!'}
            </h2>
            <p style={{ color: '#78716C', fontSize: '0.88rem', margin: 0, lineHeight: 1.45 }}>
              {step === 'email' && "Enter your registered email address and we'll send a 6-digit verification code to reset your password."}
              {step === 'otp' && `We've generated a 6-digit code for ${email}. Enter it below to proceed.`}
              {step === 'newPassword' && 'Choose a strong new password with at least 6 characters.'}
              {step === 'success' && 'Your account password has been updated. You are now logged in.'}
            </p>
          </div>

          {/* Progress Step Indicator */}
          {step !== 'success' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '1.75rem',
              }}
            >
              <div
                style={{
                  height: '4px',
                  flex: 1,
                  borderRadius: '2px',
                  backgroundColor: '#D97706',
                  transition: 'all 0.3s',
                }}
              />
              <div
                style={{
                  height: '4px',
                  flex: 1,
                  borderRadius: '2px',
                  backgroundColor: step === 'otp' || step === 'newPassword' ? '#D97706' : '#E7E5E4',
                  transition: 'all 0.3s',
                }}
              />
              <div
                style={{
                  height: '4px',
                  flex: 1,
                  borderRadius: '2px',
                  backgroundColor: step === 'newPassword' ? '#D97706' : '#E7E5E4',
                  transition: 'all 0.3s',
                }}
              />
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: '#DC2626',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ──────────────── STEP 1: EMAIL ──────────────── */}
          {step === 'email' && (
            <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Input
                label="Registered Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="e.g. sharma@gmail.com"
                leftIcon={<Mail size={16} />}
                autoFocus
              />

              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={isAuthLoading}
                rightIcon={isAuthLoading ? <Loader size={18} className="spin" /> : <ArrowRight size={18} />}
              >
                {isAuthLoading ? 'Sending Code…' : 'Send Verification Code'}
              </Button>
            </form>
          )}

          {/* ──────────────── STEP 2: 6-DIGIT OTP ──────────────── */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#44403C',
                    marginBottom: '0.6rem',
                    textAlign: 'center',
                  }}
                >
                  Enter 6-Digit Verification Code
                </label>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onPaste={handleOtpPaste}
                >
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      style={{
                        width: 'clamp(38px, 11vw, 48px)',
                        height: 'clamp(46px, 13vw, 56px)',
                        borderRadius: '12px',
                        border: digit ? '2px solid #D97706' : '1px solid #D6D3D1',
                        backgroundColor: digit ? '#FFFBEB' : '#FFFFFF',
                        textAlign: 'center',
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        color: '#1C1917',
                        outline: 'none',
                        transition: 'all 0.15s',
                        boxShadow: digit ? '0 0 0 3px rgba(217, 119, 6, 0.15)' : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Development Hint Box */}
              {devOtp && (
                <div
                  style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', color: '#92400E' }}>
                    <span style={{ fontWeight: 700 }}>Test Code:</span>{' '}
                    <code style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '2px' }}>{devOtp}</code>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    style={{
                      background: '#D97706',
                      color: '#FFF',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={isAuthLoading || otpDigits.join('').length !== 6}
                rightIcon={isAuthLoading ? <Loader size={18} className="spin" /> : <ArrowRight size={18} />}
              >
                {isAuthLoading ? 'Verifying Code…' : 'Verify & Continue'}
              </Button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  color: '#78716C',
                  borderTop: '1px solid #F5F1E9',
                  paddingTop: '1rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setErrorMessage(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#78716C',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.82rem',
                  }}
                >
                  <ArrowLeft size={14} /> Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isAuthLoading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: resendTimer > 0 ? '#A8A29E' : '#D97706',
                    cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                  }}
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {/* ──────────────── STEP 3: SET NEW PASSWORD ──────────────── */}
          {step === 'newPassword' && (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ position: 'relative' }}>
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPasswordValue}
                  onChange={(e) => {
                    setNewPasswordValue(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="At least 6 characters"
                  leftIcon={<Lock size={16} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716C', display: 'flex' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  autoFocus
                />
              </div>

              <div style={{ position: 'relative' }}>
                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Re-enter password"
                  leftIcon={<Lock size={16} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716C', display: 'flex' }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
              </div>

              {/* Password checklist */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.8rem', color: '#64748B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: newPasswordValue.length >= 6 ? '#059669' : '#64748B' }}>
                  <Check size={14} color={newPasswordValue.length >= 6 ? '#059669' : '#CBD5E1'} />
                  <span>Minimum 6 characters long</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: newPasswordValue && newPasswordValue === confirmPassword ? '#059669' : '#64748B' }}>
                  <Check size={14} color={newPasswordValue && newPasswordValue === confirmPassword ? '#059669' : '#CBD5E1'} />
                  <span>Passwords match</span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={isAuthLoading || newPasswordValue.length < 6 || newPasswordValue !== confirmPassword}
                rightIcon={isAuthLoading ? <Loader size={18} className="spin" /> : <ArrowRight size={18} />}
              >
                {isAuthLoading ? 'Updating Password…' : 'Reset Password & Sign In'}
              </Button>
            </form>
          )}

          {/* ──────────────── STEP 4: SUCCESS ──────────────── */}
          {step === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
              <div
                style={{
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  color: '#065F46',
                  fontSize: '0.9rem',
                }}
              >
                Your password has been securely updated. You are now authenticated with your new credentials.
              </div>

              <Button
                size="lg"
                fullWidth
                onClick={() => navigate('/orders')}
                rightIcon={<ArrowRight size={18} />}
              >
                Go to My Orders
              </Button>

              <Link
                to="/"
                style={{
                  color: '#D97706',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Continue Shopping on Storefront
              </Link>
            </div>
          )}

          {/* Footer Back Link */}
          {step !== 'success' && (
            <div
              style={{
                textAlign: 'center',
                marginTop: '1.75rem',
                borderTop: '1px solid #E7E5E4',
                paddingTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.88rem',
                color: '#78716C',
              }}
            >
              Remember your password?{' '}
              <Link to="/login" style={{ color: '#D97706', fontWeight: 700 }}>
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
