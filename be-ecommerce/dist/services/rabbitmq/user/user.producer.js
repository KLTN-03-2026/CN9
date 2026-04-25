"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishVerifyEmail = void 0;
const publisher_1 = require("../publisher");
const queues_1 = require("../queues");
const publishVerifyEmail = (payload) => {
    (0, publisher_1.publish)(queues_1.QUEUES.VERIFY_EMAIL, payload);
};
exports.publishVerifyEmail = publishVerifyEmail;
