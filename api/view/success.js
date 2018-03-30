module.exports = {
  set: (res, data) => {
    res.json({
      status: 'OK',
      data,
    });
  },
};
