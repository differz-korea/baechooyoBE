"use strict";
/**
 * delivery-agency router
 */

const {
  BusinessType,
} = require("../../../extensions/users-permissions/type/business-type");

module.exports = {
  routes: [
    {
      method: "POST",
      /** 자신의 배달대행 정보를 등록 및 수정 하는 라우트 */
      path: "/delivery-agency",
      handler: "delivery-agency.registerOrEdit",
      config: {
        policies: [
          /** 계정이 배달업체로 등록된 사용자만 등록 할 수 있다 */
          {
            name: "global::business-type-check",
            config: BusinessType.DELIVERY,
          },
        ],
      },
    },
    {
      method: "GET",
      /** 자신의 배달대행업체 정보를 불러오는 라우트 */
      path: "/delivery-agency",
      handler: "delivery-agency.getByUser",
    },
    {
      method: "GET",
      /** 자신 외에 타 배달대행업체 정보를 불러오는 라우트 */
      path: "/delivery-agency/:id",
      handler: "delivery-agency.findOne",
    },
    {
      method: "GET",
      /** 메인페이지에 보여줄 배달대행업체들 정보를 불러오는 라우트 */
      path: "/delivery-agencies",
      handler: "delivery-agency.getForMain",
    },
    {
      method: "POST",
      /** 지역정보를 기반해 배달대행업체들 정보를 불러오는 라우트 */
      path: "/locations-delivery-agencies",
      handler: "delivery-agency.getByLocations",
    },
  ],
};
