import prisma from "../PrismaClient";
import { CreateUserType, UpdateUserType } from "../types/UserType";

const createUser = async (data: CreateUserType) =>
  await prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      points: true,
      avatar: true,
      is_active: true,
      is_verifyEmail: true,
      createdAt: true,
      updatedAt: true,
    },
  });

const getAllUsers = async (search?: string, skip = 0, take = 10) => {
  const where = search ? { name: { contains: search } } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        points: true,
        avatar: true,
        is_active: true,
        is_verifyEmail: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users.map(({ _count, is_active, ...rest }) => ({
      ...rest,
      countOrder: _count.orders,
      isActive: is_active,
    })),
    total,
  };
};

const getUserById = async (id: number) =>
  await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      points: true,
      avatar: true,
      is_active: true,
      pointHistory: true,
      is_verifyEmail: true,
    },
  });

const getUserByEmail = async (email: string) =>
  await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      phone: true,
      address: true,
      points: true,
      avatar: true,
      is_active: true,
      is_verifyEmail: true,
      createdAt: true,
      updatedAt: true,
    },
  });

const getUserByName = async (name: string) =>
  await prisma.user.findFirst({
    where: { name },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      phone: true,
      address: true,
      points: true,
      avatar: true,
      is_active: true,
      is_verifyEmail: true,
      createdAt: true,
      updatedAt: true,
    },
  });

const updateUserById = async (id: number, data: UpdateUserType) => {
  return await prisma.$transaction(async (tx) => {
    const incrementPoints = Number(data.points) ? Number(data.points) : 0;

    const user = await tx.user.update({
      where: { id },
      data: {
        address: data.address,
        avatar: data.avatar,
        email: data.email,
        name: data.name,
        phone: data.phone,
        ...(incrementPoints !== 0 && {
          points: { increment: incrementPoints },
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        points: true,
        avatar: true,
      },
    });

    const shouldLogPoints = data.type && incrementPoints !== 0;
    if (shouldLogPoints) {
      await tx.pointHistory.create({
        data: {
          points: incrementPoints,
          type: data.type!,
          description: data.description,
          userId: user.id,
        },
      });
    }

    return user;
  });
};

const deleteUserById = async (id: number) =>
  await prisma.user.delete({
    where: { id },
  });

const updateUserPoints = async (id: number, points: number) =>
  await prisma.user.update({
    where: { id },
    data: {
      points: { increment: points },
    },
    select: {
      id: true,
      name: true,
      points: true,
    },
  });

const checkNameExcludeId = async (name: string, id: number) =>
  await prisma.user.findFirst({ where: { name, NOT: { id } } });

const searchUser = async (nameUser: string) =>
  await prisma.user.findMany({
    where: { name: { contains: nameUser } },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      phone: true,
      address: true,
      points: true,
      avatar: true,
      is_active: true,
      is_verifyEmail: true,
      createdAt: true,
      updatedAt: true,
    },
  });

const getTotalUsers = async (startDate: Date, endDate: Date) => {
  const result = await prisma.user.aggregate({
    _count: true,
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return result._count;
};

const verifyUserEmail = async (id: number) =>
  await prisma.user.update({
    where: { id },
    data: { is_verifyEmail: true },
  });

const toggleUserActive = async (id: number, isActive: boolean) => {
  return await prisma.user.update({
    where: { id },
    data: { is_active: isActive },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

const userModel = {
  createUser,
  searchUser,
  getAllUsers,
  getUserById,
  getTotalUsers,
  getUserByName,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  verifyUserEmail,
  toggleUserActive,
  updateUserPoints,
  checkNameExcludeId,
};

export default userModel;
