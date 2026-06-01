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
  const [newGroupName, setNewGroupName] = useState("");
  const navigate = useNavigate();

  // 초기 데이터 로드
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

  // 검색
  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchPings(e.target.value, categoryId);
  };

  // 카테고리 필터
  const handleCategory = (e) => {
    setCategoryId(e.target.value);
    fetchPings(search, e.target.value);
  };

  // 그룹 추가
  const handleCreateGroup = async () => {
    if (!newGroupName) return;
    await createGroup(newGroupName);
    setNewGroupName("");
    setShowGroupModal(false);
    fetchGroups();
  };

  return (
    <div>
      <div>
        <img className={styles.logo_img} src={logo} alt="Show Ping! 로고"></img>
        <Hamburger /> 
      </div>
        
      {/* 검색창 + 카테고리 드롭다운 */}
      <div>
        <input
          type="text"
          placeholder="검색"
          value={search}
          onChange={handleSearch}
        />
        <select onChange={handleCategory} value={categoryId}>
          <option value="">전체 카테고리</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* 그룹 목록 */}
      <div>
        {groups.map((g) => (
          <div key={g.id} onClick={() => navigate(`/group/${g.id}`)}>
            <p>{g.name}</p>
          </div>
        ))}
        <button onClick={() => setShowGroupModal(true)}>+ 그룹 추가</button>
      </div>

      {/* 위시리스트 목록 */}
      <div>
        {pings.map((p) => (
          <div key={p.id} onClick={() => navigate(`/ping/update/${p.id}`)}>
            <p>{p.name}</p>
            <p>{p.price}원</p>
          </div>
        ))}
      </div>

      {/* 우측 하단 + 버튼 */}
      <button onClick={() => navigate("/ping/add")}>+</button>

      {/* 그룹 추가 모달 */}
      {showGroupModal && (
        <div>
          <div>
            <p>그룹 추가</p>
            <input
              type="text"
              placeholder="그룹 이름을 입력하세요"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <button onClick={handleCreateGroup}>추가</button>
            <button onClick={() => setShowGroupModal(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PingMain;