

const client = function client(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket
    ? req.connection.socket.remoteAddress
    : null);
};


module.exports = {
  client,
};
