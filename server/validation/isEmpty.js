//returns true if empty (duh!)

const isEmpty = (data) => {
  return (
    data === undefined ||
    data === null ||
    (typeof data === "object" && Object.keys(data).length === 0) ||
    (typeof data === "string" && data.trim().length === 0)
  );
};

module.exports = isEmpty;
