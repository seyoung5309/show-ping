import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../api/profile";
import { getCategories } from "../api/ping";
import styles from "./SetSecond.module.css";
import logo from "../assets/logo.png";

function SetSecond() {
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modal, setModal] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchCurrentCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const fetchCurrentCategories = async () => {
    const data = await getProfile();
    if (data.categories) {
      setSelectedIds(data.categories.map((c) => c.id));
    }
  };

  const handleToggle = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      if (selectedIds.length >= 5) {
        setModal("관심사는 최대 5개까지 선택할 수 있어요.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = async () => {
    const data = await getProfile();
    await updateProfile(data.nickname, data.comment, selectedIds);
    navigate("/profile");
  };

  return (
    <div className={styles.page}>

      {/* 헤더 */}
      <div className={styles.header}>
        <button className={styles.back_btn} onClick={() => navigate(-1)}>← 뒤로가기</button>
        <img className={styles.logo_img} src={logo} alt="Show Ping! 로고" onClick={() => navigate("/main")}/>
      </div>

      <div className={styles.title_wrap}>
        <p className={styles.title}>관심사를 골라주세요!</p>
        <p className={styles.subtitle}>최대 5개</p>
      </div>

      {/* 카테고리 태그 */}
      <div className={styles.categories}>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`${styles.category_tag} ${selectedIds.includes(c.id) ? styles.selected : ""}`}
            onClick={() => handleToggle(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* 완료 버튼 */}
      <div className={styles.submit_wrap}>
        <button className={styles.submit_btn} onClick={handleSubmit}>완료</button>
      </div>

      {/* 모달 */}
      {modal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p>{modal}</p>
            <button className={styles.modal_btn} onClick={() => setModal("")}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SetSecond;