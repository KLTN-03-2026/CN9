"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCronJobs = void 0;
const report_cron_1 = require("./report.cron");
const initCronJobs = () => {
    (0, report_cron_1.dailyReportCron)();
};
exports.initCronJobs = initCronJobs;
