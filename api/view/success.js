module.exports = {
  set: (res, result, session) => {
    let data = false;
    const me = {};
    if (session.person) {
      me.id = session.person.id;
      me.alias = session.person.alias;
    }
    // format collection with pagination
    
    if (result.pagination){
      data =  {
        pagination: result.pagination,
        records: result.models
      }
    }
    else {
      data = result;
    }


    res.set('Content-Type', 'application/json; charset=utf-8');
    res.json({
      status: 'OK',
      data,
      me,
    });
  },
};
