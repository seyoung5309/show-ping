const {
  findAllPings,
  findPingById,
  createPing,
  updatePing,
  deletePing,
  togglePublic,
  addCategoryToPing,
  deleteCategoryFromPing,
  findCategoryByPingId,
  findPropertiesByPingId,
  deletePropertiesByPingId,
} = require("../models/pingModel");

const {
  findProperty,
  createProperty,
  addPingProperty,
} = require("../models/propertyModel");

// 전체 목록 조회
const getPings = async (req, res) => {
  const { search, categoryId } = req.query;
  const pings = await findAllPings(req.user.id, search, categoryId);
  res.status(200).json(pings);
};

// 상세 조회
const getPing = async (req, res) => {
  const ping = await findPingById(req.params.id, req.user.id);
  if (!ping)
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  const category = await findCategoryByPingId(req.params.id);
  const properties = await findPropertiesByPingId(req.params.id);
  res.status(200).json({
    ...ping,
    categoryId: category ? category.category_id : null,
    properties,
  });
};

// 추가
const createPingController = async (req, res) => {
  const { name, price, comment, categoryId, link } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "이름과 가격은 필수입니다." });
  }
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const id = await createPing(req.user.id, image, name, price, comment, link);
  if (categoryId) await addCategoryToPing(id, categoryId);
  res.status(201).json({ message: "상품이 추가되었습니다.", id });
};

// 수정
const updatePingController = async (req, res) => {
  const { name, price, comment, categoryId, link, properties } = req.body;
  const ping = await findPingById(req.params.id, req.user.id);
  if (!ping)
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  const image = req.file ? `/uploads/${req.file.filename}` : ping.image;
  await updatePing(
    req.params.id,
    req.user.id,
    image,
    name,
    price,
    comment,
    link,
  );
  if (categoryId) {
    await deleteCategoryFromPing(req.params.id);
    await addCategoryToPing(req.params.id, categoryId);
  }
  await deletePropertiesByPingId(req.params.id);
  if (properties) {
    const parsed = JSON.parse(properties);
    for (const prop of parsed) {
      if (prop.name && prop.value) {
        let property = await findProperty(prop.name, prop.dataType);
        if (!property) {
          const id = await createProperty(prop.name, prop.dataType);
          property = { id };
        }
        await addPingProperty(req.params.id, property.id, prop.value);
      }
    }
  }
  res.status(200).json({ message: "상품이 수정되었습니다." });
};

// 삭제
const deletePingController = async (req, res) => {
  const ping = await findPingById(req.params.id, req.user.id);
  if (!ping)
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  await deletePing(req.params.id, req.user.id);
  res.status(200).json({ message: "상품이 삭제되었습니다." });
};

// 공개/비공개 토글
const togglePublicController = async (req, res) => {
  const ping = await findPingById(req.params.id, req.user.id);
  if (!ping)
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  await togglePublic(req.params.id, req.user.id);
  res.status(200).json({ message: "공개 여부가 변경되었습니다." });
};

module.exports = {
  getPings,
  getPing,
  createPing: createPingController,
  updatePing: updatePingController,
  deletePing: deletePingController,
  togglePublic: togglePublicController,
};
