const mockRequire = require('mock-require');
const importFresh = require('import-fresh');

exports.mochaHooks = {
  beforeAll() {
    // override database connection config values so we
    // access our test database. override smtp config
    // values so we never accidentally send emails while
    // testing
    process.env.NODE_CONFIG = JSON.stringify({
      database: {
        connection: {
          host: 'localhost',
          port: '33060',
          user: 'root',
          password: 'meirim_test',
          database: 'meirim_test'
        }
      },
      email: {
        options: {
          host: 'smtp.example.com',
          port: 465,
          secure: true,
          auth: {
            user: 'user',
            pass: 'pass'
          }
        }
      }
    });
    
    const testConfig = importFresh('config');
    mockRequire('config', testConfig);
  },
  
  afterAll() {
    mockRequire.stop('config');
  },  
};
