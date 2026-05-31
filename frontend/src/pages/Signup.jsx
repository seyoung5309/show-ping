import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkNickname, signup } from "../api/auth";
import styles from "./Signup.module.css";
import logo from '../assets/logo.png';

function Signup() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(null); // null: 미확인, true: 사용가능, false: 중복
  const [modal, setModal] = useState("");
  const navigate = useNavigate();

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (!nickname) {
      setModal("닉네임을 입력해주세요.");
      return;
    }
    const data = await checkNickname(nickname);
    if (data.message === "사용 가능한 닉네임입니다.") {
      setNicknameChecked(true);
    } else {
      setNicknameChecked(false);
    }
    setModal(data.message);
  };

  // 회원가입
  const handleSignup = async () => {
    if (!nicknameChecked) {
      setModal("닉네임 중복 확인을 해주세요.");
      return;
    }
    if (!email) {
      setModal("이메일을 입력해주세요.");
      return;
    }
    if (!password) {
      setModal("비밀번호를 입력해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      setModal("비밀번호가 일치하지 않습니다.");
      setPassword("");
      setPasswordConfirm("");
      return;
    }

    const data = await signup(email, password, passwordConfirm, nickname);
    if (data.message === "회원가입이 완료되었습니다.") {
      setModal("회원가입이 완료되었습니다.");
      setTimeout(() => navigate("/login"), 1000);
    } else {
      setModal(data.message);
    }
  };

  return (
    <div className={styles.main_body}>
      <img className={styles.main_img} src={logo} alt="Show Ping! 로고"></img>
      {/* 닉네임 */}
      <div className={styles.box_config}>
        <label className={styles.main_text}>닉네임</label>
        <div className={styles.nickname_row}>
          <input
            className={styles.main_box}
            type="text"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setNicknameChecked(null);
            }}
          />
          <button
            className={nicknameChecked === true ? styles.check_btn_success : styles.check_btn}
            onClick={handleCheckNickname}
          >
            {nicknameChecked === true ? "확인완료" : "중복확인"}
          </button>
        </div>
      </div>

      {/* 이메일 */}
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

      {/* 비밀번호 */}
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

      {/* 비밀번호 재입력 */}
      <div className={styles.box_config}>
        <label className={styles.main_text}>비밀번호 재입력</label>
        <input
          className={styles.main_box}
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </div>

      {/* 회원가입 버튼 */}
      <button className={styles.main_box_signup} onClick={handleSignup}>
        회원가입
      </button>

      {/* 로그인으로 이동 */}
      <div className={styles.main_box_text}>
        <label className={styles.main_box_text_isuser}>이미 회원이라면?</label>
        <button className={styles.main_box_text_login} onClick={() => navigate("/login")}>
          로그인
        </button>
      </div>

      {/* 팝업 모달 */}
      {modal && (
        <div className={styles.overlay}>
          <div className={styles.modal_box}>
            <p>{modal}</p>
            <button onClick={() => setModal("")}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;