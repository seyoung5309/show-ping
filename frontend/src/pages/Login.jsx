import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import styles from "./Login.module.css";
import logo from '../assets/logo.png';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const data = await login(email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/main");
    } else {
      setError(data.message);
    }
  };

  return (
    <div className={styles.main_body}>
      <img className={styles.main_img} src={logo} alt="Show Ping! 로고"></img>
      
      <div className={styles.box_config}>
        <label className={styles.main_text}>이메일</label>
        <input
          className={styles.main_box}
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.box_config}>
        <label className={styles.main_text}>비밀번호</label>
        <input
          className={styles.main_box}
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

        {error && (
        <div className={styles.overlay}>
            <div className={styles.modal_box}>
            <p>{error}</p>
            <button className={styles.modal_button} onClick={() => setError("")}>확인</button>
            </div>
        </div>
        )}

      <div>
        <button className={styles.main_box_login} onClick={handleLogin}>로그인</button>
        <div className={styles.main_box_text}>
            <label className={styles.main_box_text_notuser}>아직 회원이 아니라면?</label>
            <button className={styles.main_box_text_signup} onClick={() => navigate("/signup")}>회원가입</button>
        </div>
      </div>
    </div>
  );
}

export default Login;