"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishVerifyEmail = exports.publishOrderStatusUpdateEmail = exports.publishOrderConfirmationEmail = void 0;
const publisher_1 = require("../publisher");
const queues_1 = require("../queues");
const publishOrderConfirmationEmail = (payload) => {
    (0, publisher_1.publish)(queues_1.QUEUES.ORDER_CONFIRMATION_EMAIL, payload);
};
exports.publishOrderConfirmationEmail = publishOrderConfirmationEmail;
const publishOrderStatusUpdateEmail = (payload) => {
    (0, publisher_1.publish)(queues_1.QUEUES.ORDER_STATUS_UPDATE_EMAIL, payload);
};
exports.publishOrderStatusUpdateEmail = publishOrderStatusUpdateEmail;
const publishVerifyEmail = (payload) => {
    (0, publisher_1.publish)(queues_1.QUEUES.VERIFY_EMAIL, payload);
};
exports.publishVerifyEmail = publishVerifyEmail;
