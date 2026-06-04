import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPings, getGroups, createGroup, getCategories } from "../api/ping";
import styles from "./PingMain.module.css";
import logo from '../assets/logo.png';
import Hamburger from "../components/Hamburger";

function PingMain() {
  const [pings, setPings] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPings();
    fetchGroups();
    fetchCategories();
  }, []);

  const fetchPings = async (s = search, c = categoryId) => {
    const data = await getPings(s, c);
    setPings(data);
  };

  const fetchGroups = async () => {
    const data = await getGroups();
    setGroups(data);
  };

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchPings(e.target.value, categoryId);
  };

  const handleCategory = (id) => {
    setCategoryId(id);
    fetchPings(search, id);
    setShowCategoryModal(false);
  };

  const handleCreateGroup = async () => {
    if (!newGroupName) return;
    await createGroup(newGroupName);
    setNewGroupName("");
    setShowGroupModal(false);
    fetchGroups();
  };

  return (
    <div className={styles.page}>

      {/* 상단 헤더 */}
      <div className={styles.header}>
        <img className={styles.logo_img} src={logo} alt="Show Ping! 로고" />
        <Hamburger />
      </div>

      {/* 검색창 */}
      <div className={styles.search_wrap}>
        <input
          className={styles.search}
          type="text"
          placeholder="상품 검색"
          value={search}
          onChange={handleSearch}
        />
        <span className={styles.search_icon}>🔍</span>
      </div>

      {/* 그룹 목록 */}
      <div className={styles.group_wrap}>
        {groups.map((g) => (
          <div key={g.id} className={styles.group_item} onClick={() => navigate(`/group/${g.id}`)}>
            <div className={styles.group_thumb}></div>
            <p className={styles.group_name}>{g.name}</p>
          </div>
        ))}
        <div className={styles.group_item}>
          <div className={styles.group_add} onClick={() => setShowGroupModal(true)}>+</div>
        </div>
      </div>

      {/* 카테고리 버튼 */}
      <div className={styles.category_wrap}>
        <button className={styles.category_btn} onClick={() => setShowCategoryModal(true)}>
          카테고리
        </button>
      </div>

      {/* 위시리스트 목록 */}
      <div className={styles.ping_grid}>
        {pings.map((p) => (
            <div key={p.id} className={styles.ping_card} onClick={() => navigate(`/ping/update/${p.id}`)}>
            {p.image
                ? <img src={`http://localhost:3000${p.image}`} alt={p.name} className={styles.ping_img} />
                : <div className={styles.ping_img}></div>
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

      {/* 우측 하단 + 버튼 */}
      <button className={styles.fab} onClick={() => navigate("/ping/add")}>+</button>

      {/* 그룹 추가 모달 */}
      {showGroupModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p className={styles.modal_title}>그룹 추가</p>
            <input
              className={styles.modal_input}
              type="text"
              placeholder="그룹 이름을 입력하세요"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <div className={styles.modal_btns}>
              <button className={styles.modal_btn_cancel} onClick={() => setShowGroupModal(false)}>취소</button>
              <button className={styles.modal_btn_confirm} onClick={handleCreateGroup}>추가</button>
            </div>
          </div>
        </div>
      )}

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

export default PingMain;