'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('shop', [{
      name: '苹果',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: '英伟达',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: '特斯拉',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: '美团',
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('shop', null, {});
  }
};
