import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, getPublicPings, getPublicGroups, togglePublic } from "../api/profile";
import { getCategories } from "../api/ping";
import { getFriendCount } from "../api/friend";
import styles from "./Profile.module.css";
import logo from "../assets/logo.png";
import Hamburger from "../components/Hamburger";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [pings, setPings] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [friendCount, setFriendCount] = useState(0);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("latest");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchPings();
    fetchGroups();
    fetchFriendCount();
    fetchCategories();
  }, []);

  const fetchProfile = async () => {
    const data = await getProfile();
    setProfile(data);
  };

  const fetchFriendCount = async () => {
    const data = await getFriendCount();
    setFriendCount(data.count);
  };

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const fetchPings = async (c = "", so = "latest") => {
    const data = await getPublicPings(c, so);
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

  const handleSort = (e) => {
    setSort(e.target.value);
    fetchPings(categoryId, e.target.value);
  };

  const handleCategory = (id) => {
    setCategoryId(id);
    fetchPings(id, sort);
    setShowCategoryModal(false);
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
        <div className={styles.profile_img_wrap} onClick={() => navigate("/set-first")}>
          {profile.image
            ? <img src={`${API_URL}${profile.image}`} alt="프로필" className={styles.profile_img} />
            : <div className={styles.profile_img_empty} />
          }
        </div>
        <div className={styles.profile_info}>
          <p className={styles.nickname}>{profile.nickname}</p>
          <p className={styles.comment} onClick={() => navigate("/set-first")} style={{ cursor: "pointer" }}>
            {profile.comment || "자기소개가 없습니다."}
          </p>
          <div className={styles.profile_meta}>
            <span className={styles.friends} onClick={() => navigate("/friends")}>
              친구 {friendCount}명
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
        {profile.categories && profile.categories.length > 0
          ? profile.categories.map((c) => (
              <span key={c.id} className={styles.category_tag}>{c.name}</span>
            ))
          : <span className={styles.no_category}>카테고리가 없습니다.</span>
        }
      </div>

      {/* 그룹 목록 */}
      <div className={styles.group_wrap}>
        {groups.map((g) => (
          <div key={g.id} className={styles.group_item} onClick={() => navigate(`/group/${g.id}`)}>
            <div className={styles.group_thumb}>
              {g.image
                ? <img src={`${API_URL}${g.image}`} alt={g.name} className={styles.group_thumb_img} />
                : <div />
              }
            </div>
            <p className={styles.group_name}>{g.name}</p>
          </div>
        ))}
        <div className={styles.group_item}>
          <div className={styles.group_add} onClick={() => navigate("/main")}>+</div>
        </div>
      </div>

      {/* 정렬 + 카테고리 */}
      <div className={styles.filter_wrap}>
        <select className={styles.sort_btn} onChange={handleSort} value={sort}>
          <option value="latest">생성순</option>
          <option value="oldest">오래된 순</option>
          <option value="low">낮은 가격순</option>
          <option value="high">높은 가격순</option>
          <option value="name">가나다순</option>
        </select>
        <button className={styles.category_btn} onClick={() => setShowCategoryModal(true)}>
          카테고리
        </button>
      </div>

      {/* 공개 위시리스트 목록 */}
      <div className={styles.ping_grid}>
        {pings.map((p) => (
          <div key={p.id} className={styles.ping_card} onClick={() => navigate(`/ping/update/${p.id}`)}>
            {p.image
              ? <img src={p.image} alt={p.name} className={styles.ping_img} />
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

      {/* 카테고리 모달 */}
      {showCategoryModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p className={styles.modal_title}>카테고리</p>
            <div className={styles.category_list}>
              <button className={styles.category_item} onClick={() => handleCategory("")}>전체</button>
              {categories.map((c) => (
                <button key={c.id} className={styles.category_item} onClick={() => handleCategory(c.id)}>
                  {c.name}
                </button>
              ))}
            </div>
            <button className={styles.modal_btn_cancel} onClick={() => setShowCategoryModal(false)}>닫기</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;