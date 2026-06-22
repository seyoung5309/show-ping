import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPings, getGroups, createGroup, getCategories } from "../api/ping";
import styles from "./PingMain.module.css";
import logo from '../assets/logo.png';
import Hamburger from "../components/Hamburger";
import mainButtonIcon from '../assets/mainButton.svg';
import searchIcon from '../assets/search.svg';

function PingMain() {
  const [pings, setPings] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [sort, setSort] = useState("latest");
  const navigate = useNavigate();
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [selectedPings, setSelectedPings] = useState([]);

  useEffect(() => {
    fetchPings();
    fetchGroups();
    fetchCategories();
  }, []);

  const fetchPings = async (s = search, c = categoryId, so = sort) => {
    const data = await getPings(s, c, so);
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

  const handleSort = (e) => {
    setSort(e.target.value);
    fetchPings(search, categoryId, e.target.value);
  };

  const handleSelectCompare = (e, pingId) => {
    e.stopPropagation();
    setSelectedPings((prev) =>
      prev.includes(pingId)
        ? prev.filter((id) => id !== pingId)
        : [...prev, pingId]
    );
  };

  const handleCompare = () => {
    if (selectedPings.length < 2) return alert("비교할 상품을 2개 이상 선택해주세요.");
    navigate("/compare", { state: { pingIds: selectedPings } });
    setShowFabMenu(false);
  };

  return (
    <div className="page">

      {/* 상단 헤더 */}
      <div className="header">
        <img className="logo_img" src={logo} alt="Show Ping! 로고" onClick={() => navigate("/main")} />
        <Hamburger />
      </div>

      {/* 검색창 */}
      <div className="search_wrap">
        <input
          className={styles.search}
          type="text"
          placeholder="상품 검색"
          value={search}
          onChange={handleSearch}
        />
        <img src={searchIcon} alt="검색" className="search_icon" />
      </div>

      {/* 그룹 목록 */}
      <div className="group_wrap">
        <div className="group_item">
          <div className={styles.group_add} onClick={() => setShowGroupModal(true)}>+</div>
        </div>
        {groups.map((g) => (
          <div key={g.id} className="group_item" onClick={() => navigate(`/group/${g.id}`)}>
            <div className="group_thumb">
              {g.image
                ? <img src={g.image} alt={g.name} className="group_thumb_img" />
                : <div />
              }
            </div>
            <p className="group_name">{g.name}</p>
          </div>
        ))}
      </div>

      {/* 카테고리, 정렬 버튼 */}
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

      {/* 위시리스트 목록 */}
      <div className="ping_grid">
        {pings.map((p) => (
          <div key={p.id} className="ping_card" onClick={() => navigate(`/ping/update/${p.id}`)}>
            {p.image
              ? <img src={p.image} alt={p.name} className="ping_img" />
              : <div className="ping_img"></div>
            }
            <button
              className={`${styles.compare_btn} ${selectedPings.includes(p.id) ? styles.compare_btn_active : ""}`}
              onClick={(e) => handleSelectCompare(e, p.id)}
            >
              {selectedPings.includes(p.id) ? "선택중" : "비교 선택"}
            </button>
            <div className="ping_info">
              <div className="ping_row">
                <span className="ping_name">{p.name}</span>
                <span className="ping_price">{p.price.toLocaleString()}원</span>
              </div>
              <p className="ping_comment">{p.comment}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 우측 하단 버튼 */}
      <div className="fab_wrap">
        <div className={`${styles.fab_menu} ${showFabMenu ? styles.fab_menu_open : ""}`}>
          <button className={styles.fab_menu_btn} onClick={handleCompare}>
            위시리스트 비교 {selectedPings.length > 0 && `(${selectedPings.length})`}
          </button>
          <button className={styles.fab_menu_btn} onClick={() => navigate("/ping/add")}>
            위시리스트 추가
          </button>
        </div>
        <button className="fab" onClick={() => setShowFabMenu(!showFabMenu)}>
          <img src={mainButtonIcon} alt="메뉴 열기" className="fab_icon" />
        </button>
      </div>

      {/* 그룹 추가 모달 */}
      {showGroupModal && (
        <div className="overlay">
          <div className="modal">
            <p className="modal_title">그룹 추가</p>
            <input
              className={styles.modal_input}
              type="text"
              placeholder="그룹 이름을 입력하세요"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <div className={styles.modal_btns}>
              <button className="modal_btn_cancel" onClick={() => setShowGroupModal(false)}>취소</button>
              <button className="modal_btn_confirm" onClick={handleCreateGroup}>추가</button>
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 모달 */}
      {showCategoryModal && (
        <div className="overlay">
          <div className="modal">
            <p className="modal_title">카테고리</p>
            <div className={styles.category_list}>
              <button className={styles.category_item} onClick={() => handleCategory("")}>전체</button>
              {categories.map((c) => (
                <button key={c.id} className={styles.category_item} onClick={() => handleCategory(c.id)}>
                  {c.name}
                </button>
              ))}
            </div>
            <button className="modal_btn_cancel" onClick={() => setShowCategoryModal(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PingMain;