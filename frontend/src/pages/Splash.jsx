import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = localStorage.getItem('token'); 
      
      if (user) {
        navigate('/main');   // 로그인 된 경우 → 메인으로
      } else {
        navigate('/login');  // 로그인 안 된 경우 → 로그인으로
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#fff',
    }}>
      <img src={logo} alt="Show Ping!" style={{ width: '60%', maxWidth: '300px' }} />
    </div>
  );
}

export default Splash;