"use strict";

/**
 * phone-auth controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::phone-auth.phone-auth",
  ({ strapi }) => ({
    async sendKey(ctx) {
      // 휴대전화번호로 인증키를 보내는 컨트롤러
      // 1. user에 현재 등록된 전화가 있는지 확인
      const { phoneNumber } = ctx.request.body;
      if (!phoneNumber) {
        return ctx.badRequest("휴대전화번호 보내주세요");
      }
      const entry = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            phoneNumber: phoneNumber,
          },
        });
      if (entry) {
        ctx.badRequest("이미 해당 휴대전화번호로 등록된 유저가 있습니다!");
      }
      await strapi.db.query("api::phone-auth.phone-auth").delete({
        where: {
          phoneNumber,
        },
      });
      // 2. 난수 생성
      let key = "";
      for (let i = 0; i < 6; i++) {
        key += Math.floor(Math.random() * 10);
      }
      // 3. DB 저장
      await strapi.entityService.create("api::phone-auth.phone-auth", {
        data: {
          phoneNumber,
          key,
          isAuthenticated: false,
        },
      });
      //4. 인증키를 네이버 클라우드 플랫폼으로 보낸다.
      console.log(key);
      return "인증키를 보냈습니다";
    },
    async authenticateKey(ctx) {
      const { phoneNumber, key } = ctx.request.body;
      const findedKey = await strapi.db
        .query("api::phone-auth.phone-auth")
        .findOne({
          where: {
            phoneNumber,
            key,
            isAuthenticated: false,
          },
          orderBy: {
            createdAt: "DESC",
          },
        });
      if (!findedKey) {
        return false;
      }
      const requestDate = new Date(findedKey.createdAt);
      var elapsedMSec = new Date().getTime() - requestDate.getTime();
      var elapsedMin = elapsedMSec / 1000 / 60;
      if (elapsedMin > 3) {
        console.log("인증시간 초과됨");
        // 인증 시간 초과
        return false;
      }
      await strapi.db.query("api::phone-auth.phone-auth").update({
        data: {
          isAuthenticated: true,
          isExpired: false,
        },
        where: {
          id: findedKey.id,
        },
      });
      return true;
    },
  })
);
