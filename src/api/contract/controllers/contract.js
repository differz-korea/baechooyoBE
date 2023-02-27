"use strict";

/**
 * contract controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::contract.contract",
  ({ strapi }) => ({
    /** 계약서를 작성하는 핸들러 */
    async create(ctx) {},
    /** 아이디로 계약서를 불러오는 핸들러 */
    async getById(ctx) {
      // 1. 계약서가 자신과 관련된것인지 체크한다.
      // 2. 계약서 정보를 반환한다.
    },
    /** 자신이 속해있는 계약 리스트를 불러오는 핸들러 */
    async getMyList(ctx) {
      // 1. 자신의 계약들을 모두 불러와서 반환한다.
    },
    async approve(ctx) {
      // 1. 계약을 승인한다.
    },
    /** 계약서를 수정하는 핸들러 */
    async edit(ctx) {
      // 1. 계약서가 자신과 관련된것인지 체크한다.
      // 2. 계약서가 거부된 상태인지 체크한다.
      // 3. 계약 수정시 배달대행업체의 계약동의가 null로 바뀌고, 계약서를 대기중 상태로 업데이트한다.
    },
  })
);
