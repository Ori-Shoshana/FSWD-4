import { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  // Handles both login and registration logic based on isRegistering state
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('שם משתמש וסיסמה נדרשים');
      return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (isRegistering) {
      if (users[username]) {
        setError('שם משתמש כבר קיים במערכת');
        return;
      }
      users[username] = { password };
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', username);
      onLogin(username);
    } else {
      const user = users[username];
      if (!user) {
        setError('שם משתמש לא קיים');
        return;
      }
      if (user.password !== password) {
        setError('סיסמה שגויה');
        return;
      }
      localStorage.setItem('currentUser', username);
      onLogin(username);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">
        {isRegistering ? 'הרשמה למערכת' : 'כניסה למערכת'}
      </h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label htmlFor="username">
            שם משתמש:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
        </div>

        <div>
          <label htmlFor="password">
            סיסמה:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
        </div>

        <button type="submit" className="login-submit-button">
          {isRegistering ? 'הרשם' : 'התחבר'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="toggle-button"
          >
            {isRegistering ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הרשם'}
          </button>
        </div>
      </form>
    </div>
  );
}