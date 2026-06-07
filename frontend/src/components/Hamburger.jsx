import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { withdraw } from "../api/auth";
import styles from "./Hamburger.module.css";
import logo from "../assets/logo.png";

function Hamburger() {
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState("");
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsOpen(false);
    navigate("/login");
  };

  const handleWithdraw = async () => {
    await withdraw();
    localStorage.removeItem("token");
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* 햄버거 버튼 */}
      <div className={styles.hamburger} onClick={() => setIsOpen(true)}>
        <div className={styles.bar} />
        <div className={styles.bar} />
        <div className={styles.bar} />
      </div>

      {/* 사이드 메뉴 */}
      <nav className={`${styles.side_menu} ${isOpen ? styles.active : ""}`}>
        <img src={logo} alt="Show Ping!" className={styles.menu_logo} />

        <div className={styles.menu_items}>
          <button onClick={() => handleNavigate("/main")}>위시리스트</button>
          <button onClick={() => handleNavigate("/profile")}>프로필</button>
          <button onClick={() => handleNavigate("/friends")}>친구</button>
        </div>

        <div className={styles.menu_bottom}>
          <button onClick={handleLogout}>로그아웃</button>
          <button onClick={() => setModal("정말 탈퇴하시겠어요?")}>회원 탈퇴</button>
        </div>

        {/* 뒤로가기 */}
        <div className={styles.back} onClick={() => setIsOpen(false)}>
          <p>뒤로가기</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 12 24" fill="none">
            <path d="M2.45199 6.58023L3.51299 5.52024L9.29199 11.2972C9.38514 11.3898 9.45907 11.4999 9.50952 11.6211C9.55997 11.7424 9.58594 11.8724 9.58594 12.0037C9.58594 12.1351 9.55997 12.2651 9.50952 12.3863C9.45907 12.5076 9.38514 12.6177 9.29199 12.7102L3.51299 18.4902L2.45299 17.4302L7.87699 12.0052L2.45199 6.58023Z" fill="#FE679C"/>
          </svg>
        </div>
      </nav>

      {/* 배경 클릭 시 닫기 */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}

      {/* 회원 탈퇴 확인 모달 */}
      {modal && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal}>
            <p>{modal}</p>
            <div className={styles.modal_btns}>
              <button className={styles.modal_cancel} onClick={() => setModal("")}>취소</button>
              <button className={styles.modal_confirm} onClick={handleWithdraw}>탈퇴</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Hamburger;