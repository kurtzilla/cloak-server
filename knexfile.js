require('dotenv').config();

module.exports = {

  development: {
    client: 'pg',
    connection: process.env.REACT_APP_DATABASE_URL,
    migrations: {
      directory: './src/migrations'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.REACT_APP_DATABASE_URL,
    migrations: {
      directory: './src/migrations'
    }
  }

};
