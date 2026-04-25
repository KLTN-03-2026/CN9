"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createReview = async (data) => {
    return await PrismaClient_1.default.review.create({
        data,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
};
const getAllReviews = async (skip = 0, take = 10) => {
    const [reviews, total] = await Promise.all([
        PrismaClient_1.default.review.findMany({
            skip,
            take,
            include: {
                product: { select: { name_product: true, image_url: true } },
                orderItem: { select: { variant: { select: { image_url: true } } } },
                user: { select: { id: true, name: true, avatar: true } },
                reviewer: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
        }),
        PrismaClient_1.default.review.count(),
    ]);
    return {
        data: reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            content: review.comment,
            createdAt: review.createdAt,
            status: review.status,
            product: {
                name: review.product.name_product,
                imageProduct: review.orderItem?.variant.image_url,
            },
            user: { name: review.user.name, avatar: review.user.avatar },
        })),
        total,
    };
};
const getReviewById = async (id) => {
    const review = await PrismaClient_1.default.review.findUnique({
        where: { id },
        select: {
            id: true,
            status: true,
            images: true,
            rating: true,
            comment: true,
            user: { select: { name: true, avatar: true } },
            product: { select: { name_product: true } },
            orderItem: { select: { variant: { select: { image_url: true } } } },
            createdAt: true,
            shopReply: true,
        },
    });
    if (!review) {
        throw new Error("Review not founded");
    }
    const images = JSON.parse(review.images || "[]");
    return {
        id: review.id,
        status: review.status,
        createdAt: review.createdAt,
        images,
        user: { name: review.user.name, avatar: review.user.avatar },
        product: {
            name: review.product.name_product,
            imageProduct: review.orderItem?.variant.image_url,
        },
        content: review.comment,
        rating: review.rating,
        shopReply: review.shopReply,
    };
};
const getReviewsByProductId = async (productId) => await PrismaClient_1.default.review.findMany({
    where: {
        productId,
    },
    include: {
        user: {
            select: {
                id: true,
                name: true,
                avatar: true,
            },
        },
    },
    orderBy: {
        createdAt: "desc",
    },
});
const getReviewsByUserId = async (userId) => await PrismaClient_1.default.review.findMany({
    where: { userId },
    include: {},
    orderBy: {
        createdAt: "desc",
    },
});
const getPendingReviews = async () => {
    const reviews = await PrismaClient_1.default.review.findMany({
        where: { status: "PENDING" },
        include: {
            product: { select: { name_product: true, image_url: true } },
            orderItem: { select: { variant: { select: { image_url: true } } } },
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
            reviewer: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return reviews.map((review) => {
        return {
            id: review.id,
            rating: review.rating,
            content: review.comment,
            createdAt: review.createdAt,
            status: review.status,
            product: {
                name: review.product.name_product,
                imageProduct: review.orderItem?.variant.image_url,
            },
            user: { name: review.user.name, avatar: review.user.avatar },
        };
    });
};
const updateReviewById = async (id, data) => await PrismaClient_1.default.review.update({
    where: { id },
    data: {
        ...data,
        ...(data.is_approved && { approved_at: new Date() }),
    },
    include: {
        user: {
            select: {
                id: true,
                name: true,
                avatar: true,
            },
        },
    },
});
const deleteReviewById = async (id) => await PrismaClient_1.default.review.delete({
    where: { id },
});
const moderateReview = async (reviewId, adminId, status) => {
    return PrismaClient_1.default.review.update({
        where: { id: reviewId },
        data: {
            status,
            approved_by: adminId,
            approved_at: new Date(),
        },
    });
};
const replyToReview = async (reviewId, adminId, content) => {
    const review = await PrismaClient_1.default.review.findUnique({
        where: { id: reviewId },
    });
    if (!review) {
        throw new Error("Review not found");
    }
    if (review.shopReply) {
        throw new Error("Review already replied");
    }
    return PrismaClient_1.default.review.update({
        where: { id: reviewId },
        data: {
            shopRepliedBy: adminId,
            shopReply: content,
            shopRepliedAt: new Date(),
        },
    });
};
const checkReview = async (userId, orderItemId) => {
    const review = await PrismaClient_1.default.review.findFirst({
        where: { userId, orderItemId },
    });
    return !!review;
};
const reviewModel = {
    checkReview,
    createReview,
    getAllReviews,
    getReviewById,
    replyToReview,
    moderateReview,
    updateReviewById,
    deleteReviewById,
    getPendingReviews,
    getReviewsByUserId,
    getReviewsByProductId,
};
exports.default = reviewModel;
