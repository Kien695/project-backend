module.exports = (query) => {
  let objectSearch = {
    keyword: "",
  };

  if (query.keyword) {
    objectSearch.keyword = query.keyword;
    const regex = new RegExp(objectSearch.keyword, "i"); //i : không phân biệt hoa thường khi tìm kiếm
    objectSearch.regex = regex;
  }
  return objectSearch;
};
