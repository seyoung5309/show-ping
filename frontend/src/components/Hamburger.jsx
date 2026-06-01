import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Hamburger.module.css";

function Hamburger() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* 햄버거 버튼 */}
      <div className={styles.hamburger} onClick={() => setIsOpen(true)} />

      {/* 사이드 메뉴 */}
      <nav className={`${styles.side_menu} ${isOpen ? styles.active : ""}`}>
        <p>Show Ping!</p>
        <button onClick={() => handleNavigate("/main")}>홈</button>
        <button onClick={() => handleNavigate("/profile")}>프로필</button>
        <button onClick={() => handleNavigate("/friends")}>친구</button>

        {/* 뒤로가기 */}
        <div className={styles.back} onClick={() => setIsOpen(false)}>
          <p>뒤로가기</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 12 24" fill="none">
            <path d="M2.45199 6.58023L3.51299 5.52024L9.29199 11.2972C9.38514 11.3898 9.45907 11.4999 9.50952 11.6211C9.55997 11.7424 9.58594 11.8724 9.58594 12.0037C9.58594 12.1351 9.55997 12.2651 9.50952 12.3863C9.45907 12.5076 9.38514 12.6177 9.29199 12.7102L3.51299 18.4902L2.45299 17.4302L7.87699 12.0052L2.45199 6.58023Z" fill="white"/>
          </svg>
        </div>
      </nav>

      {/* 배경 클릭 시 닫기 */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}

export default Hamburger;