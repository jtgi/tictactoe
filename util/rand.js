module.exports = function(max) {
  return Math.max((Math.ceil(Math.random() * max) - 1), 0);
}

