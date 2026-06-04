const {
  findAllGroups,
  findGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  togglePublic,
  addPingToGroup,
  removePingFromGroup,
  findPingsInGroup,
} = require("../models/groupModel");

const getGroups = async (req, res) => {
  const groups = await findAllGroups(req.user.id);
  res.status(200).json(groups);
};

const createGroupController = async (req, res) => {
  const { name, image } = req.body;
  if (!name)
    return res.status(400).json({ message: "그룹 이름은 필수입니다." });
  const id = await createGroup(req.user.id, name, image);
  res.status(201).json({ message: "그룹이 생성되었습니다.", id });
};

const updateGroupController = async (req, res) => {
  const { name, image } = req.body;
  const group = await findGroupById(req.params.id, req.user.id);
  if (!group)
    return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
  await updateGroup(req.params.id, req.user.id, name, image);
  res.status(200).json({ message: "그룹이 수정되었습니다." });
};

const deleteGroupController = async (req, res) => {
  const group = await findGroupById(req.params.id, req.user.id);
  if (!group)
    return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
  await deleteGroup(req.params.id, req.user.id);
  res.status(200).json({ message: "그룹이 삭제되었습니다." });
};

const togglePublicController = async (req, res) => {
  const group = await findGroupById(req.params.id, req.user.id);
  if (!group)
    return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
  await togglePublic(req.params.id, req.user.id);
  res.status(200).json({ message: "공개 여부가 변경되었습니다." });
};

const addPingToGroupController = async (req, res) => {
  const { pingId } = req.body;
  const group = await findGroupById(req.params.id, req.user.id);
  if (!group)
    return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
  await addPingToGroup(req.params.id, pingId);
  res.status(200).json({ message: "상품이 그룹에 추가되었습니다." });
};

const removePingFromGroupController = async (req, res) => {
  const group = await findGroupById(req.params.id, req.user.id);
  if (!group)
    return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
  await removePingFromGroup(req.params.id, req.params.pingId);
  res.status(200).json({ message: "상품이 그룹에서 제거되었습니다." });
};

const getPingsInGroup = async (req, res) => {
  const group = await findGroupById(req.params.id, req.user.id);
  if (!group)
    return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
  const pings = await findPingsInGroup(req.params.id);
  res.status(200).json(pings);
};

const getGroupController = async (req, res) => {
  const group = await findGroupById(req.params.id, req.user.id);
  if (!group)
    return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
  res.status(200).json(group);
};

module.exports = {
  getGroups,
  createGroup: createGroupController,
  updateGroup: updateGroupController,
  deleteGroup: deleteGroupController,
  togglePublic: togglePublicController,
  addPingToGroup: addPingToGroupController,
  removePingFromGroup: removePingFromGroupController,
  getPingsInGroup,
  getGroup: getGroupController,
};
