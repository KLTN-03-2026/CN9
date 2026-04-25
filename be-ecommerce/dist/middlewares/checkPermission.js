"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
const checkPermission = (permissionCode) => {
    return (req, res, next) => {
        if (!req.user?.permissions.includes(permissionCode)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};
exports.checkPermission = checkPermission;
