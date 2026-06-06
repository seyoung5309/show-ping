import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserProfile } from "../api/profile";
import styles from "./UserProfile.module.css";
import logo from "../assets/logo.png";
import Hamburger from "../components/Hamburger";

function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const data = await getUserProfile(userId);
    if (data.message) {
      setError(data.message);
    } else {
      setProfile(data);
    }
  };

  if (error) return (
    <div className={styles.page}>
      <div className={styles.header}>
        <img className={styles.logo_img} src={logo} alt="Show Ping! 로고" />
        <Hamburger />
      </div>
      <button className={styles.back_btn} onClick={() => navigate(-1)}>← 뒤로가기</button>
      <p className={styles.error}>{error}</p>
    </div>
  );

  if (!profile) return <div>로딩 중...</div>;

  return (
    <div className={styles.page}>

      {/* 헤더 */}
      <div className={styles.header}>
        <img className={styles.logo_img} src={logo} alt="Show Ping! 로고" />
        <Hamburger />
      </div>

      {/* 뒤로가기 */}
      <button className={styles.back_btn} onClick={() => navigate(-1)}>← 뒤로가기</button>

      {/* 프로필 섹션 */}
      <div className={styles.profile_section}>
        <div className={styles.profile_img_wrap}>
          {profile.image
            ? <img src={`http://localhost:3000${profile.image}`} alt="프로필" className={styles.profile_img} />
            : <div className={styles.profile_img_empty} />
          }
        </div>
        <div className={styles.profile_info}>
          <p className={styles.nickname}>{profile.nickname}</p>
          <p className={styles.comment}>{profile.comment}</p>
        </div>
      </div>

      {/* 관심사 태그 */}
      <div className={styles.categories}>
        {profile.categories && profile.categories.map((c) => (
          <span key={c.id} className={styles.category_tag}>{c.name}</span>
        ))}
      </div>

      {/* 공개 그룹 목록 */}
      <div className={styles.group_wrap}>
        {profile.groups && profile.groups.map((g) => (
          <div key={g.id} className={styles.group_item}>
            <div className={styles.group_thumb}>
              {g.image && <img src={`http://localhost:3000${g.image}`} alt={g.name} />}
            </div>
            <p className={styles.group_name}>{g.name}</p>
          </div>
        ))}
      </div>

      {/* 공개 위시리스트 목록 */}
      <div className={styles.ping_grid}>
        {profile.pings && profile.pings.map((p) => (
          <div key={p.id} className={styles.ping_card}>
            {p.image
              ? <img src={`http://localhost:3000${p.image}`} alt={p.name} className={styles.ping_img} />
              : <div className={styles.ping_img} />
            }
            <div className={styles.ping_info}>
              <div className={styles.ping_row}>
                <span className={styles.ping_name}>{p.name}</span>
                <span className={styles.ping_price}>{p.price.toLocaleString()}원</span>
              </div>
              <p className={styles.ping_comment}>{p.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserProfile;