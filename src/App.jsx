import { useState } from 'react';
import MultiTextApp from './MultiTextApp';
import Login from './components/Login';

export default function App() {
  // Initialize with checking localStorage only once
  const initialUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
  const [currentUser, setCurrentUser] = useState(initialUser);
  
  const handleLogin = (username) => {
    setCurrentUser(username);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };
  
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }
  
  return (
    <div>
      <div className="user-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ccc'
      }}>
        <h3>ברוך הבא, {currentUser}</h3>
        <button 
          onClick={handleLogout}
          style={{
            padding: '8px 15px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          התנתק
        </button>
      </div>
      
      <MultiTextApp currentUser={currentUser} />
    </div>
  );
}