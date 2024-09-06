const createTree = (arr, parentId = "") => {
  const Tree = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      const newItem = item;
      const children = createTree(arr, item.id);
      if (children.length > 0) {
        newItem.children = children;
      }
      Tree.push(newItem);
    }
  });
  return Tree;
};

module.exports.tree = (arr, parentId = "") => {
  const tree = createTree(arr, (parentId = ""));
  return tree;
};
