import React, { useState, useEffect } from 'react';
import { FaLock, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import './PasswordDialog.css';

const PasswordDialog = ({ 
  show, 
  onConfirm, 
  onCancel, 
  title = "كلمة السر", 
  message = "أدخل كلمة السر للوصول",
  correctPassword = "WallZ"
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      setPassword('');
      setError('');
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('كلمة السر مطلوبة');
      return;
    }

    if (password === correctPassword) {
      onConfirm(password);
      setPassword('');
      setError('');
    } else {
      setError('كلمة السر غير صحيحة');
      setPassword('');
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    onCancel();
  };

  if (!show) return null;

  return (
    <div className="password-dialog-overlay">
      <div className="password-dialog">
        <div className="password-dialog-header">
          <div className="password-dialog-title">
            <FaLock className="password-icon" />
            <h3>{title}</h3>
          </div>
          <button 
            className="password-dialog-close" 
            onClick={handleCancel}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="password-dialog-body">
          <p className="password-dialog-message">{message}</p>
          
          <form onSubmit={handleSubmit} className="password-form">
            <div className="password-input-group">
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة السر"
                  className="password-input"
                  autoFocus
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {error && (
                <div className="password-error">
                  {error}
                </div>
              )}
            </div>

            <div className="password-dialog-actions">
              <button 
                type="button" 
                className="password-cancel-btn"
                onClick={handleCancel}
              >
                إلغاء
              </button>
              <button 
                type="submit" 
                className="password-confirm-btn"
              >
                تأكيد
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordDialog;
