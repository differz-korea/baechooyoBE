"use strict";

const {
  BusinessType,
} = require("../../../extensions/users-permissions/type/business-type");

/**
 * contract router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = {
  routes: [
    {
      method: "POST",
      /** 소상공인과 배달대행업체의 계약여부를 결정하는 라우트 */
      // body로 계약 승인 여부를 true 또는 false로 받는다
      // 먼저 계약서의 status가 null이라면 패스
      // 두 번째로 계약서의 responder가 현재 유저와 일치해야한다
      // 마지막으로 계약서의 status를 Approved 또는 Rejected로 결정한다
      path: "/response/contract",
      handler: "contract.response",
      policies: [
        {
          name: "global::business-type-check",
          config: BusinessType.DELIVERY,
        },
      ],
    },
    {
      method: "POST",
      /** 소상공인과 배달대행업체의 계약을 취소하는 라우트 */
      // 먼저 계약서의 status가 approved이면 패스
      // 두 번째로 현재 유저가 계약서의 responder 또는 requester과 일치해야한다
      // 마지막으로 두명 모두 취소를 하면, 계약서의 status를 canceled로 업데이트한다
      path: "/cancel/contract",
      handler: "contract.cancel",
    },
    {
      method: "GET",
      /** 자신과 관련된 계약의 디테일 정보를 불러오기 */
      path: "/contract/:id",
      handler: "contract.getById",
    },
    {
      method: "GET",
      /** 자신과 관련된 계약 정보들을 불러오기 */
      path: "/contract",
      handler: "contract.getMyList",
    },
    {
      method: "POST",
      /** 소상공인과 배달대행업체의 계약을 생성하는 라우트 */
      path: "/contract",
      handler: "contract.create",
      policies: [
        {
          name: "global::business-type-check",
          config: BusinessType.MERCHANT,
        },
      ],
    },
    {
      method: "PUT",
      /** 소상공인과 배달대행업체의 계약을 수정하는 라우트 */
      // 먼저 계약서의 requester가 현재 유저와 일치해야한다.
      // 두번째로 계약서의 status가 null이여야한다.
      // 계약서를 수정한다.
      path: "/contract/:id",
      handler: "contract.edit",
      policies: [
        {
          name: "global::business-type-check",
          config: BusinessType.MERCHANT,
        },
      ],
    },
  ],
};
