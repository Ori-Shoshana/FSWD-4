import { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('שם משתמש וסיסמה נדרשים');
      return;
    }
    
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (isRegistering) {
      // Registration mode
      if (users[username]) {
        setError('שם משתמש כבר קיים במערכת');
        return;
      }
      
      // Add new user
      users[username] = { password };
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto login after registration
      localStorage.setItem('currentUser', username);
      onLogin(username);
    } else {
      // Login mode
      const user = users[username];
      
      if (!user) {
        setError('שם משתמש לא קיים');
        return;
      }
      
      if (user.password !== password) {
        setError('סיסמה שגויה');
        return;
      }
      
      // Successful login
      localStorage.setItem('currentUser', username);
      onLogin(username);
    }
  };

  return (
    <div className="login-container" style={{ 
      maxWidth: '400px', 
      margin: '100px auto', 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center' }}>
        {isRegistering ? 'הרשמה למערכת' : 'כניסה למערכת'}
      </h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffeeee', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
            שם משתמש:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc' 
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            סיסמה:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc' 
            }}
          />
        </div>
        
        <button 
          type="submit" 
          style={{
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {isRegistering ? 'הרשם' : 'התחבר'}
        </button>
        
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0066cc',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            {isRegistering ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הרשם'}
          </button>
        </div>
      </form>
    </div>
  );
}