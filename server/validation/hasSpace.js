//returns true if string has space (duh!)

const hasSpace = (data) => {
  return /\s/g.test(data);
};

module.exports = hasSpace;
