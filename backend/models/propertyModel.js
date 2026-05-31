const pool = require("../db");

// 속성 찾기 (이름 + 타입 조합)
const findProperty = async (name, dataType) => {
  const [rows] = await pool.query(
    "SELECT * FROM property WHERE name = ? AND data_type = ?",
    [name, dataType],
  );
  return rows[0];
};

// 속성 생성
const createProperty = async (name, dataType) => {
  const [result] = await pool.query(
    "INSERT INTO property (name, data_type) VALUES (?, ?)",
    [name, dataType],
  );
  return result.insertId;
};

// 상품에 속성 값 추가
const addPingProperty = async (pingId, propertyId, value) => {
  await pool.query(
    "INSERT INTO ping_property (ping_id, property_id, value) VALUES (?, ?, ?)",
    [pingId, propertyId, value],
  );
};

// 미사용 속성 삭제
const deleteUnusedProperties = async () => {
  await pool.query(
    `DELETE FROM property 
     WHERE id NOT IN (SELECT DISTINCT property_id FROM ping_property)`,
  );
};

module.exports = {
  findProperty,
  createProperty,
  addPingProperty,
  deleteUnusedProperties,
};
