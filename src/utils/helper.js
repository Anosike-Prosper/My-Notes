function trimString(obj) {
  // console.log(obj)
  const query = {};

  if (obj.title) {
    query.title = obj.title.trim();
  }

  if (obj.body) {
    query.body = obj.body.trim();
  }

  return query;
}

module.exports = { trimString };
