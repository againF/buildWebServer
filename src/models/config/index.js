// -{
// -  "development": {
// -    "username": "root",
// -    "password": null,
// -    "database": "database_development",
// -    "host": "127.0.0.1",
// -    "dialect": "mysql"
// -  },
// -  "test": {
// -    "username": "root",
// -    "password": null,
// -    "database": "database_test",
// -    "host": "127.0.0.1",
// -    "dialect": "mysql"
// -  },
// -  "production": {
// -    "username": "root",
// -    "password": null,
// -    "database": "database_production",
// -    "host": "127.0.0.1",
// -    "dialect": "mysql"
// -  }
// -}
module.exports = {
  development: {
    dialect: 'sqlite',
    storage: 'database/index.js',
    define: {
      underscored:true,
    },
    migrationStorageTableName: 'sequelize_meta',
  }
}