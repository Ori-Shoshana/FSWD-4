import { useState } from 'react';
import MultiTextApp from './MultiTextApp';
import Login from './components/Login';

export default function App() {
  // Initialize with checking localStorage only once
  const initialUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [darkMode, setDarkMode] = useState(true); // מצב התחלתי: כהה

  const handleLogin = (username) => {
    setCurrentUser(username);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };
  
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.className = newMode ? 'dark' : 'light';
  };
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }
  
  return (
       <div className="app">
      <header className="app-header">
        <div className="user-info">
          ברוך הבא, {currentUser}
        </div>
        <div className="header-actions">
        <button onClick={toggleDarkMode} className="toggle-theme-button">
  {darkMode ? '☀️ Light' : '🌙 Dark'}
</button>

          <button onClick={handleLogout} className="logout-button">
            🚪 התנתק
          </button>
        </div>
      </header>
      
      <MultiTextApp currentUser={currentUser} />
    </div>
  );
}