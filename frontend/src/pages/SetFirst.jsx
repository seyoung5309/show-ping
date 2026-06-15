import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadProfileImage, updateProfile, getProfile } from "../api/profile";
import styles from "./SetFirst.module.css";
import logo from "../assets/logo.png";
const API_URL = import.meta.env.VITE_API_URL;

function SetFirst() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [comment, setComment] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const data = await getProfile();
    setComment(data.comment || "");
    setNickname(data.nickname || "");
    setImagePreview(data.image ? `${API_URL}${data.image}` : null);
  };

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
    await updateProfile(nickname, comment, []);
    navigate("/profile");
  };

  return (
    <div className={styles.page}>

      {/* 헤더 */}
      <div className={styles.header}>
        <button className={styles.back_btn} onClick={() => navigate(-1)}>← 뒤로가기</button>
        <img className={styles.logo_img} src={logo} alt="Show Ping! 로고" onClick={() => navigate("/main")}/>
      </div>

      <p className={styles.title}>당신에 대해서 알려주세요!<br />사진 업로드 및 자기소개</p>

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

      {/* 자기소개 */}
      <div className={styles.comment_section}>
        <label className={styles.comment_label}>자기 소개</label>
        <textarea
          className={styles.comment_input}
          placeholder="자기소개를 입력해 주세요."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* 완료 버튼 */}
      <div className={styles.submit_wrap}>
        <button className={styles.submit_btn} onClick={handleSubmit}>완료</button>
      </div>
    </div>
  );
}

export default SetFirst;