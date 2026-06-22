import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPing,
  createPing,
  updatePing,
  deletePing,
  togglePublic,
  addProperty,
  getCategories,
} from "../api/ping";
import styles from "./PingAddUpdate.module.css";
import logo from "../assets/logo.png";
import Hamburger from "../components/Hamburger";

function PingAddUpdate() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([
    { name: "", dataType: "text", value: "" },
  ]);
  const [link, setLink] = useState("");
  const [modal, setModal] = useState("");

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchPing();
  }, []);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const fetchPing = async () => {
    const data = await getPing(id);
    setName(data.name || "");
    setPrice(data.price || "");
    setComment(data.comment || "");
    setLink(data.link || "");
    setIsPublic(data.is_public === 1);
    setImagePreview(data.image ? data.image : null);
    if (data.categoryId) setCategoryId(data.categoryId);
    if (data.properties && data.properties.length > 0) {
      setProperties(data.properties);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAddProperty = () => {
    setProperties([...properties, { name: "", dataType: "text", value: "" }]);
  };

  const handlePropertyChange = (index, field, value) => {
    const updated = [...properties];
    updated[index][field] = value;
    setProperties(updated);
  };

  const handleTogglePublic = async () => {
    if (isEdit) await togglePublic(id);
    setIsPublic(!isPublic);
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    await deletePing(id);
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!name) return setModal("상품명을 입력해주세요.");
    if (!price) return setModal("가격을 입력해주세요.");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("comment", comment);
      formData.append("link", link);
      formData.append("properties", JSON.stringify(properties));
      if (categoryId) formData.append("categoryId", categoryId);
      if (image) formData.append("image", image);

      let pingId = id;
      if (isEdit) {
        await updatePing(id, formData);
      } else {
        const data = await createPing(formData);
        pingId = data.id;
      }

      if (!isEdit) {
        for (const prop of properties) {
          if (prop.name && prop.value) {
            await addProperty(pingId, prop.name, prop.dataType, prop.value);
          }
        }
      }

      navigate(-1);
    } catch (err) {
      console.error(err.message);
      setModal("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={styles.page}>

      {/* 헤더 */}
      <div className={styles.header}>
        <img className={styles.logo_img} src={logo} alt="Show Ping! 로고" onClick={() => navigate("/main")} />
        <Hamburger />
      </div>

      {/* 뒤로가기 */}
      <button className={styles.back_btn} onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>

      {/* 공개 토글 + 삭제 버튼 */}
      <div className={styles.top_row}>
        <div className={styles.toggle_wrap} onClick={handleTogglePublic}>
          <div className={`${styles.toggle} ${isPublic ? styles.toggle_on : ""}`}>
            <div className={styles.toggle_circle} />
          </div>
          <span className={styles.toggle_text}>{isPublic ? "공개중" : "비공개"}</span>
        </div>
        {isEdit && (
          <button className={styles.delete_btn} onClick={handleDelete}>
            상품 삭제하기
          </button>
        )}
      </div>

      {/* 이미지 업로드 */}
      <label className={styles.image_box} htmlFor="imageInput">
        {imagePreview
          ? <img src={imagePreview} alt="상품 이미지" className={styles.image_preview} />
          : <span className={styles.image_placeholder}>+</span>
        }
      </label>
      <input
        id="imageInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImage}
      />

      {/* 상품명 */}
      <div className={styles.field}>
        <input
          className={styles.input_line}
          type="text"
          placeholder="상품명"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* 가격 */}
      <div className={styles.field}>
        <input
          className={styles.input_line}
          type="number"
          placeholder="가격"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      {/* 카테고리 */}
      <div className={styles.field}>
        <select
          className={styles.input_line}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">카테고리</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* 설명 */}
      <div className={styles.field}>
        <label className={styles.label}>설명</label>
        <textarea
          className={styles.textarea}
          placeholder="설명을 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* 사용자 정의 속성 */}
      <div className={styles.field}>
        <label className={styles.label}>사용자 정의 속성</label>
        {properties.map((prop, index) => (
          <div key={index} className={styles.property_row}>
            <select
              className={styles.property_select}
              value={prop.dataType}
              onChange={(e) => handlePropertyChange(index, "dataType", e.target.value)}
            >
              <option value="text">text</option>
              <option value="integer">integer</option>
              <option value="double">double</option>
            </select>
            <input
              className={styles.property_name}
              type="text"
              placeholder="속성명"
              value={prop.name}
              onChange={(e) => handlePropertyChange(index, "name", e.target.value)}
            />
            <input
              className={styles.property_value}
              type="text"
              placeholder="값"
              value={prop.value}
              onChange={(e) => handlePropertyChange(index, "value", e.target.value)}
            />
          </div>
        ))}
        <button className={styles.add_property_btn} onClick={handleAddProperty}>
          사용자 정의 속성 추가하기 +
        </button>
      </div>

      {/* 상품 링크 */}
      <div className={styles.field}>
        <input
          className={styles.input_line}
          type="text"
          placeholder="상품 링크"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      {/* 완료 버튼 */}
      <div className={styles.submit_wrap}>
        <button className={styles.submit_btn} onClick={handleSubmit}>완료</button>
      </div>

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

export default PingAddUpdate;