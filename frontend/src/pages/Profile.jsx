import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, getPublicPings, getPublicGroups, togglePublic } from "../api/profile";
import styles from "./Profile.module.css";
import logo from "../assets/logo.png";
import Hamburger from "../components/Hamburger";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [pings, setPings] = useState([]);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchPings();
    fetchGroups();
  }, []);

  const fetchProfile = async () => {
    const data = await getProfile();
    setProfile(data);
  };

  const fetchPings = async () => {
    const data = await getPublicPings();
    setPings(data);
  };

  const fetchGroups = async () => {
    const data = await getPublicGroups();
    setGroups(data);
  };

  const handleTogglePublic = async () => {
    await togglePublic();
    setProfile({ ...profile, is_public: !profile.is_public });
  };

  if (!profile) return <div>로딩 중...</div>;

  return (
    <div className={styles.page}>

      {/* 헤더 */}
      <div className={styles.header}>
        <img className={styles.logo_img} src={logo} alt="Show Ping! 로고" />
        <Hamburger />
      </div>

      {/* 프로필 섹션 */}
      <div className={styles.profile_section}>
        {/* 프로필 사진 */}
        <div className={styles.profile_img_wrap} onClick={() => navigate("/set-first")}>
          {profile.image
            ? <img src={`http://localhost:3000${profile.image}`} alt="프로필" className={styles.profile_img} />
            : <div className={styles.profile_img_empty} />
          }
        </div>

        {/* 우측 정보 */}
        <div className={styles.profile_info}>
          <p className={styles.nickname}>{profile.nickname}</p>
          <p className={styles.comment}>{profile.comment}</p>
          <div className={styles.profile_meta}>
            <span className={styles.friends} onClick={() => navigate("/friends")}>
              친구 0명
            </span>
            <div className={styles.toggle_wrap}>
              <div
                className={`${styles.toggle} ${profile.is_public ? styles.toggle_on : ""}`}
                onClick={handleTogglePublic}
              >
                <div className={`${styles.toggle_circle} ${profile.is_public ? styles.toggle_circle_on : ""}`} />
              </div>
              <span className={styles.is_public}>
                {profile.is_public ? "상태 공개" : "상태 비공개"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 관심사 태그 */}
      <div className={styles.categories} onClick={() => navigate("/set-second")}>
        {profile.categories && profile.categories.map((c) => (
          <span key={c.id} className={styles.category_tag}>{c.name}</span>
        ))}
      </div>

      {/* 그룹 목록 */}
      <div className={styles.group_wrap}>
        {groups.map((g) => (
          <div key={g.id} className={styles.group_item} onClick={() => navigate(`/group/${g.id}`)}>
            <div className={styles.group_thumb}>
              {g.image && <img src={`http://localhost:3000${g.image}`} alt={g.name} />}
            </div>
            <p className={styles.group_name}>{g.name}</p>
          </div>
        ))}
        <div className={styles.group_item}>
          <div className={styles.group_add} onClick={() => navigate("/main")}>+</div>
        </div>
      </div>

      {/* 공개 위시리스트 목록 */}
      <div className={styles.ping_grid}>
        {pings.map((p) => (
          <div key={p.id} className={styles.ping_card} onClick={() => navigate(`/ping/update/${p.id}`)}>
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

export default Profile;