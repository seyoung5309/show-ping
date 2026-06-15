import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFriends,
  getFriendRequests,
  searchUsers,
  sendFriendRequest,
  handleFriendRequest,
  deleteFriend,
} from "../api/friend";
import styles from "./Friends.module.css";
import logo from "../assets/logo.png";
import Hamburger from "../components/Hamburger";

function Friends() {
  const [mode, setMode] = useState("list"); // list | requests | search
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [modal, setModal] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async (s = "") => {
    const data = await getFriends(s);
    setFriends(data);
  };

  const fetchRequests = async () => {
    const data = await getFriendRequests();
    setRequests(data);
  };

  const handleFriendSearch = (e) => {
    setFriendSearch(e.target.value);
    fetchFriends(e.target.value);
  };

  const handleUserSearch = async (e) => {
    setUserSearch(e.target.value);
    if (e.target.value.trim()) {
      const data = await searchUsers(e.target.value);
      setSearchResult(data);
    } else {
      setSearchResult([]);
    }
  };

  const handleSendRequest = async (id) => {
    const data = await sendFriendRequest(id);
    setModal(data.message);
    const updated = await searchUsers(userSearch);
    setSearchResult(updated);
  };

  const handleAccept = async (id) => {
    await handleFriendRequest(id, "승인");
    fetchRequests();
    fetchFriends();
  };

  const handleReject = async (id) => {
    await handleFriendRequest(id, "거절");
    fetchRequests();
  };

  const handleDeleteFriend = async (id) => {
    await deleteFriend(id);
    fetchFriends();
  };

  return (
    <div className={styles.page}>

      {/* 헤더 */}
      <div className={styles.header}>
        <img className={styles.logo_img} src={logo} alt="Show Ping! 로고" />
        <Hamburger />
      </div>

      {/* 뒤로가기 + 타이틀 */}
      <button className={styles.back_btn} onClick={() => {
        if (mode === "list") navigate(-1);
        else setMode("list");
      }}>← 뒤로가기</button>

      {/* 검색창 */}
      {mode === "list" && (
        <div className={styles.search_wrap}>
          <input
            className={styles.search}
            type="text"
            placeholder="친구 검색"
            value={friendSearch}
            onChange={handleFriendSearch}
          />
          <span className={styles.search_icon}>🔍</span>
        </div>
      )}

      {mode === "requests" && (
        <div className={styles.search_wrap}>
          <input
            className={styles.search}
            type="text"
            placeholder="요청 검색"
            value=""
            readOnly
          />
          <span className={styles.search_icon}>🔍</span>
        </div>
      )}

      {mode === "search" && (
        <div className={styles.search_wrap}>
          <input
            className={styles.search}
            type="text"
            placeholder="사용자 검색"
            value={userSearch}
            onChange={handleUserSearch}
          />
          <span className={styles.search_icon}>🔍</span>
        </div>
      )}

        {/* 친구 목록 모드 */}
        {mode === "list" && (
        <>
            <div className={styles.mode_row}>
            <button className={styles.mode_btn} onClick={() => setMode("search")}>
                친구 추가
            </button>
            <button className={styles.mode_btn} onClick={() => { setMode("requests"); fetchRequests(); }}>
                친구 요청
            </button>
            </div>
            <div className={styles.user_list}>
            {friends.map((f) => (
                <div key={f.id} className={styles.user_item}>
                <div className={styles.user_img_wrap} onClick={() => navigate(`/profile/${f.id}`)} style={{ cursor: "pointer" }}>
                    {f.image
                    ? <img src={`${API_URL}${f.image}`} alt={f.nickname} className={styles.user_img} />
                    : <div className={styles.user_img_empty} />
                    }
                </div>
                <div className={styles.user_info}>
                    <p className={styles.user_name}>{f.nickname}</p>
                    <p className={styles.user_comment}>{f.comment}</p>
                </div>
                <button className={styles.delete_btn} onClick={() => handleDeleteFriend(f.id)}>
                    삭제
                </button>
                </div>
            ))}
            </div>
        </>
        )}

        {/* 친구 요청 모드 */}
        {mode === "requests" && (
        <div className={styles.user_list}>
            {requests.length === 0 && <p className={styles.empty}>받은 친구 요청이 없어요.</p>}
            {requests.map((r) => (
            <div key={r.id} className={styles.user_item}>
                <div className={styles.user_img_wrap} onClick={() => navigate(`/profile/${r.user_id}`)} style={{ cursor: "pointer" }}>
                {r.image
                    ? <img src={`${API_URL}${r.image}`} alt={r.nickname} className={styles.user_img} />
                    : <div className={styles.user_img_empty} />
                }
                </div>
                <div className={styles.user_info}>
                <p className={styles.user_name}>{r.nickname}</p>
                <p className={styles.user_comment}>{r.comment}</p>
                </div>
                <div className={styles.request_btns}>
                <button className={styles.reject_btn} onClick={() => handleReject(r.id)}>거절</button>
                <button className={styles.accept_btn} onClick={() => handleAccept(r.id)}>승인</button>
                </div>
            </div>
            ))}
        </div>
        )}

        {/* 사용자 검색 모드 */}
        {mode === "search" && (
        <div className={styles.user_list}>
            {searchResult.map((u) => (
            <div key={u.id} className={styles.user_item}>
                <div className={styles.user_img_wrap} onClick={() => navigate(`/profile/${u.id}`)} style={{ cursor: "pointer" }}>
                {u.image
                    ? <img src={`${API_URL}${u.image}`} alt={u.nickname} className={styles.user_img} />
                    : <div className={styles.user_img_empty} />
                }
                </div>
                <div className={styles.user_info}>
                <p className={styles.user_name}>{u.nickname}</p>
                <p className={styles.user_comment}>{u.comment}</p>
                </div>
                {u.status === "friend" && (
                <span className={styles.status_tag}>친구</span>
                )}
                {u.status === "requested" && (
                <span className={styles.status_tag}>요청중</span>
                )}
                {u.status === "none" && (
                <button className={styles.add_btn} onClick={() => handleSendRequest(u.id)}>
                    친구 추가
                </button>
                )}
            </div>
            ))}
        </div>
        )}

      {/* 모달 */}
      {modal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p>{modal}</p>
            <button className={styles.modal_btn} onClick={() => setModal("")}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Friends;