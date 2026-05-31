import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

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
    <div>
      <h1>Show Ping!</h1>
      <h2>로그인</h2>

      <div>
        <label>이메일</label>
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p>{error}</p>}

      <button onClick={handleLogin}>로그인</button>
      <button onClick={() => navigate("/signup")}>회원가입</button>
    </div>
  );
}

export default Login;