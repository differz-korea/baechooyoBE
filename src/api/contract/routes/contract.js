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
      /** 소상공인과 배달대행업체의 계약을 생성하는 라우트 */
      path: "/contract",
      handler: "contract.create",
      policies: [
        /** 계정이 소상공인으로 등록된 사용자가 배달대행업체에게 계약을 요청한다. */

        /** detail column에 대하여.. */
        /** detail column은 계약정보로 가격이나, 할증 정보나, 동 정보가 json으로 기재된건데 */
        /** 사용자가 detail column을 수정 해서 요청하려는 경우, 업체와 문의 후 계약요청을 해야한다고 알려주기  */
        /** 일반적으로 업체가 등록해놓은것으로 계약서를 작성한다. */
        {
          name: "global::business-type-check",
          config: BusinessType.MERCHANT,
        },
      ],
    },
    {
      method: "POST",
      /** 소상공인 사용자의 요청 계약을 배달대행업체가 승인하는 라우트 */
      path: "/contract",
      handler: "contract.approve",
      policies: [
        {
          name: "global::business-type-check",
          config: BusinessType.DELIVERY,
        },
      ],
    },
    {
      method: "PUT",
      /** 이미 작성된 계약서를 수정하는 라우트 */
      /** 수정 또한 계정이 소상공인으로 등록된 사용자가 한다  */
      /** 단, 수정시, 승인된 계약의 경우 다시 승인여부가 대기중으로 변경된다. */
      path: "/contract/:contractId",
      handler: "contract.edit",
      policies: [
        /** 계정이 소상공인으로 등록된 사용자가 계약을 수정한다  */
        {
          name: "global::business-type-check",
          config: BusinessType.MERCHANT,
        },
      ],
    },
    {
      method: "GET",
      /** 계약서 정보를 자세히 불러오는 라우트 */
      path: "/contract/:contractId",
      handler: "contract.getById",
    },
    {
      method: "GET",
      /** 사용자의 계약 정보를 리스트 형태로 반환하는 라우트 */
      path: "/contract",
      handler: "contract.getMyList",
    },
  ],
};
