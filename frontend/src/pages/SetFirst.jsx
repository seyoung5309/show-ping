import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadProfileImage } from "../api/profile";
import styles from "./SetFirst.module.css";
import logo from "../assets/logo.png";

function SetFirst() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      await uploadProfileImage(formData);
    }
    navigate("/profile");
  };

  return (
    <div className={styles.page}>

      {/* 헤더 */}
      <div className={styles.header}>
        <button className={styles.back_btn} onClick={() => navigate(-1)}>← 뒤로가기</button>
        <img className={styles.logo_img} src={logo} alt="Show Ping! 로고" />
      </div>

      <p className={styles.title}>당신의 프로필 사진을<br />업로드 해주세요!</p>

      {/* 이미지 업로드 */}
      <label className={styles.image_wrap} htmlFor="imageInput">
        {imagePreview
          ? <img src={imagePreview} alt="프로필 미리보기" className={styles.image_preview} />
          : (
            <div className={styles.image_placeholder}>
              <span className={styles.camera_icon}>📷</span>
              <p className={styles.placeholder_text}>클릭하여 사진을 첨부하세요.</p>
            </div>
          )
        }
      </label>
      <input
        id="imageInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImage}
      />

      {/* 완료 버튼 */}
      <div className={styles.submit_wrap}>
        <button className={styles.submit_btn} onClick={handleSubmit}>완료</button>
      </div>
    </div>
  );
}

export default SetFirst;