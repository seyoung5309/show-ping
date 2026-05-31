const {
  findProperty,
  createProperty,
  addPingProperty,
  deleteUnusedProperties: deleteUnusedPropertiesModel,
} = require("../models/propertyModel");

// 속성 추가
const addProperty = async (req, res) => {
  const { pingId, name, dataType, value } = req.body;

  if (!pingId || !name || !dataType || !value) {
    return res.status(400).json({ message: "모든 항목을 입력해주세요." });
  }

  if (!["text", "integer", "double"].includes(dataType)) {
    return res.status(400).json({
      message: "올바른 자료형을 입력해주세요. (text, integer, double)",
    });
  }

  // 이미 존재하는 속성이면 재사용, 없으면 새로 생성
  let property = await findProperty(name, dataType);
  if (!property) {
    const id = await createProperty(name, dataType);
    property = { id };
  }

  await addPingProperty(pingId, property.id, value);
  res.status(201).json({ message: "속성이 추가되었습니다." });
};

// 미사용 속성 삭제
const deleteUnusedPropertiesController = async (req, res) => {
  await deleteUnusedPropertiesModel();
  res.status(200).json({ message: "미사용 속성이 삭제되었습니다." });
};

module.exports = {
  addProperty,
  deleteUnusedProperties: deleteUnusedPropertiesController,
};
