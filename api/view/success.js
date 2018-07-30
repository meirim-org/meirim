module.exports = {
  set: (res, data, session) => {
    const me = {};
    if (session.person) {
      me.id = session.person.id;
      me.alias = session.person.alias;
    }
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.json({
      status: 'OK',
      data,
      me,
    });
  },
};
