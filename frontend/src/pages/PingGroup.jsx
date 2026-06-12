import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getGroup,
  getPingsInGroup,
  getPings,
  addPingToGroup,
  removePingFromGroup,
  updateGroup,
} from "../api/ping";
import styles from "./PingGroup.module.css";
import logo from "../assets/logo.png";
import Hamburger from "../components/Hamburger";
const API_URL = import.meta.env.VITE_API_URL;

function PingGroup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [groupPings, setGroupPings] = useState([]);
  const [allPings, setAllPings] = useState([]);
  const [search, setSearch] = useState("");
  const [showSelect, setShowSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [groupSearch, setGroupSearch] = useState("");
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  useEffect(() => {
    fetchGroup();
    fetchGroupPings();
  }, []);

  const fetchGroup = async () => {
    const data = await getGroup(id);
    setGroup(data);
  };

  const fetchGroupPings = async () => {
    const data = await getPingsInGroup(id);
    setGroupPings(data);
    setSelectedIds(data.map((p) => p.id));
  };

  const fetchAllPings = async (s = "") => {
    const data = await getPings(s);
    setAllPings(data);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchAllPings(e.target.value);
  };

  const handleOpenSelect = () => {
    setShowSelect(true);
    fetchAllPings();
  };

  const handleToggle = async (pingId) => {
    if (selectedIds.includes(pingId)) {
      await removePingFromGroup(id, pingId);
      setSelectedIds(selectedIds.filter((i) => i !== pingId));
      setGroupPings(groupPings.filter((p) => p.id !== pingId));
    } else {
      await addPingToGroup(id, pingId);
      setSelectedIds([...selectedIds, pingId]);
      const added = allPings.find((p) => p.id === pingId);
      if (added) setGroupPings([...groupPings, added]);
    }
  };

  const filteredGroupPings = groupPings.filter((p) =>
    p.name.includes(groupSearch)
  );

  const handleGroupSearch = (e) => {
    setGroupSearch(e.target.value);
  };

  const handleRename = async () => {
    if (!newGroupName.trim()) return;
    await updateGroup(id, newGroupName);
    setGroup({ ...group, name: newGroupName });
    setShowRenameModal(false);
  };

  return (
    <div className={styles.page}>

      {/* 헤더 */}
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
            value={groupSearch}
            onChange={handleGroupSearch}
        />
        <span className={styles.search_icon}>🔍</span>
      </div>

      {/* 뒤로가기 + 그룹명 */}
      <div className={styles.group_header}>
        <button className={styles.back_btn} onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
        
        <span className={styles.group_name} onClick={() => { setNewGroupName(group?.name); setShowRenameModal(true); }} style={{ cursor: "pointer" }}>
          {group?.name}
        </span>

      {/* 그룹 이름 변경 모달 */}
        {showRenameModal && (
        <div className={styles.overlay}>
            <div className={styles.modal}>
            <p className={styles.modal_title}>그룹 이름 변경</p>
            <input
                className={styles.modal_input}
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
            />
            <div className={styles.modal_btns}>
                <button className={styles.modal_btn_cancel} onClick={() => setShowRenameModal(false)}>취소</button>
                <button className={styles.modal_btn_confirm} onClick={handleRename}>변경</button>
            </div>
            </div>
        </div>
        )}
      </div>

      {!showSelect ? (
        <>
          {/* 그룹 내 위시리스트 2열 그리드 */}
            <div className={styles.ping_grid}>
            {filteredGroupPings.map((p) => (
                <div key={p.id} className={styles.ping_card} onClick={() => navigate(`/ping/update/${p.id}`)}>
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

          {/* 우측 하단 + 버튼 */}
          <button className={styles.fab} onClick={handleOpenSelect}>+</button>
        </>
      ) : (
        <>
          {/* 위시리스트 선택 목록 */}
          <div className={styles.select_list}>
            {allPings.map((p) => (
              <div key={p.id} className={styles.select_item}>
                <div className={styles.select_info}>
                  <span className={styles.ping_name}>{p.name}</span>
                  <div className={styles.select_sub}>
                    <span className={styles.ping_price}>{p.price.toLocaleString()}원</span>
                    <span className={styles.ping_category}>{p.category}</span>
                  </div>
                </div>
                <div
                  className={`${styles.toggle} ${selectedIds.includes(p.id) ? styles.toggle_on : ""}`}
                  onClick={() => handleToggle(p.id)}
                >
                  <div className={styles.toggle_circle} />
                </div>
              </div>
            ))}
          </div>

          {/* 뒤로가기 */}
          <button className={styles.fab} onClick={() => setShowSelect(false)}>←</button>
        </>
      )}
    </div>
  );
}

export default PingGroup;