import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getPing } from "../api/ping";
import styles from "./Compare.module.css";
import logo from "../assets/logo.png";
import Hamburger from "../components/Hamburger";

function Compare() {
  const navigate = useNavigate();
  const location = useLocation();
  const pingIds = location.state?.pingIds || [];
  const [pings, setPings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pingIds.length === 0) {
      navigate("/main");
      return;
    }
    fetchPings();
  }, []);

  const fetchPings = async () => {
    const results = await Promise.all(pingIds.map((id) => getPing(id)));
    setPings(results);
    setLoading(false);
  };

  // 모든 상품의 속성 키 합집합
  const allPropertyNames = [
    ...new Set(pings.flatMap((p) => (p.properties || []).map((prop) => prop.name))),
  ];

  if (loading) return <div className={styles.loading}>불러오는 중...</div>;

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <div className={styles.header}>
        <img
          className={styles.logo_img}
          src={logo}
          alt="Show Ping! 로고"
          onClick={() => navigate("/main")}
        />
        <Hamburger />
      </div>

      {/* 타이틀 */}
      <div className={styles.title_row}>
        <button className={styles.back_btn} onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
        <span className={styles.title}>상품 비교</span>
      </div>

      <p className={styles.subtitle}>{pings.length}개의 상품 비교 결과</p>

      {/* 비교 테이블 */}
      <div className={styles.table_wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th_label}></th>
              {pings.map((p) => (
                <th key={p.id} className={styles.th_product}>
                  {p.image
                    ? <img src={p.image} alt={p.name} className={styles.product_img} />
                    : <div className={styles.product_img_empty} />
                  }
                  <span className={styles.product_name}>{p.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 가격 */}
            <tr>
              <td className={styles.td_label}>가격</td>
              {pings.map((p) => (
                <td key={p.id} className={styles.td_value}>
                  {p.price?.toLocaleString()}원
                </td>
              ))}
            </tr>

            {/* 설명 */}
            <tr>
              <td className={styles.td_label}>설명</td>
              {pings.map((p) => (
                <td key={p.id} className={styles.td_value}>
                  {p.comment || "-"}
                </td>
              ))}
            </tr>

            {/* 링크 */}
            <tr>
              <td className={styles.td_label}>링크</td>
              {pings.map((p) => (
                <td key={p.id} className={styles.td_value}>
                  {p.link
                    ? <a href={p.link} target="_blank" rel="noreferrer" className={styles.link}>바로가기</a>
                    : "-"
                  }
                </td>
              ))}
            </tr>

            {/* 사용자 정의 속성 */}
            {allPropertyNames.map((propName) => (
              <tr key={propName}>
                <td className={styles.td_label}>{propName}</td>
                {pings.map((p) => {
                  const prop = (p.properties || []).find((pr) => pr.name === propName);
                  return (
                    <td key={p.id} className={styles.td_value}>
                      {prop ? prop.value : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Compare;