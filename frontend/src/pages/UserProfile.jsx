import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserProfile, getUserFriends } from "../api/profile";
import styles from "./UserProfile.module.css";
import logo from "../assets/logo.png";
import Hamburger from "../components/Hamburger";
const API_URL = import.meta.env.VITE_API_URL;

function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    const data = await getUserProfile(userId);
    if (data.message) {
      setError(data.message);
    } else {
      setProfile(data);
    }
  };

  const handleShowFriends = async () => {
    const data = await getUserFriends(userId);
    setFriends(data);
    setShowFriends(true);
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
            ? <img src={`${API_URL}${profile.image}`} alt="프로필" className={styles.profile_img} />
            : <div className={styles.profile_img_empty} />
          }
        </div>
        <div className={styles.profile_info}>
          <p className={styles.nickname}>{profile.nickname}</p>
          <p className={styles.comment}>
            {profile.comment || "자기소개가 없습니다."}
          </p>
          <span className={styles.friends} onClick={handleShowFriends}>
            친구 {profile.friendCount}명
          </span>
        </div>
      </div>

      {/* 관심사 태그 */}
      <div className={styles.categories}>
        {profile.categories && profile.categories.length > 0
          ? profile.categories.map((c) => (
              <span key={c.id} className={styles.category_tag}>{c.name}</span>
            ))
          : <span className={styles.no_category}>카테고리가 없습니다.</span>
        }
      </div>

      {/* 공개 그룹 목록 */}
      <div className={styles.group_wrap}>
        {profile.groups && profile.groups.map((g) => (
          <div key={g.id} className={styles.group_item}>
            <div className={styles.group_thumb}>
              {g.image && <img src={`${API_URL}${g.image}`} alt={g.name} className={styles.group_thumb_img} />}
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
              ? <img src={`${API_URL}${p.image}`} alt={p.name} className={styles.ping_img} />
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

      {/* 친구 목록 모달 */}
      {showFriends && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p className={styles.modal_title}>친구 목록</p>
            <div className={styles.friend_list}>
              {friends.length === 0
                ? <p className={styles.no_category}>친구가 없습니다.</p>
                : friends.map((f) => (
                    <div key={f.id} className={styles.friend_item} onClick={() => { setShowFriends(false); navigate(`/profile/${f.id}`); }}>
                      <div className={styles.friend_img_wrap}>
                        {f.image
                          ? <img src={`${API_URL}${f.image}`} alt={f.nickname} className={styles.friend_img} />
                          : <div className={styles.friend_img_empty} />
                        }
                      </div>
                      <div>
                        <p className={styles.friend_name}>{f.nickname}</p>
                        <p className={styles.friend_comment}>{f.comment}</p>
                      </div>
                    </div>
                  ))
              }
            </div>
            <button className={styles.modal_btn_cancel} onClick={() => setShowFriends(false)}>닫기</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default UserProfile;