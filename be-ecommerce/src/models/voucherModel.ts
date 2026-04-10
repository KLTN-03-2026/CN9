import prisma from "../PrismaClient";
import VoucherType from "../types/VoucherType";

const createVoucher = async (data: VoucherType) =>
  await prisma.voucher.create({ data });

const getVouchers = async (search?: string, skip = 0, take = 10) => {
  const where = search ? { code: { contains: search.trim() } } : {};

  const [vouchers, total] = await Promise.all([
    prisma.voucher.findMany({
      where,
      skip,
      take,
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.voucher.count({ where }),
  ]);

  return {
    data: vouchers.map(({ _count, is_active, ...rest }) => ({
      ...rest,
      usedCount: _count.orders,
      isActive: is_active,
    })),
    total,
  };
};

const updateVoucherById = async (id: number, data: Partial<VoucherType>) =>
  await prisma.voucher.update({ where: { id }, data });

const deleteVoucherById = async (id: number) =>
  await prisma.voucher.delete({ where: { id } });

const findVoucherById = async (id: number) => {
  const existingVoucher = await prisma.voucher.findUnique({
    where: { id },
  });

  return !!existingVoucher;
};

const getVoucherById = async (id: number) => {
  return await prisma.voucher.findUnique({
    where: { id },
    select: {
      id: true,
      code: true,
      description: true,
      min_order_value: true,
      usage_limit: true,
      discount_type: true,
      discount_value: true,
      start_date: true,
      end_date: true,
    },
  });
};

const checkCode = async (name: string) => {
  const existingCode = await prisma.voucher.findFirst({
    where: { code: name },
  });

  return !!existingCode;
};

const checkCodeExcludeId = async (name: string, id: number) => {
  const existingCode = await prisma.voucher.findFirst({
    where: { code: name, NOT: { id } },
  });

  return !!existingCode;
};

const getVoucherByCode = async (
  code: string,
  total: number,
  userId: number,
) => {
  const voucher = await prisma.voucher.findUnique({
    where: { code },
    select: {
      id: true,
      discount_type: true,
      discount_value: true,
      min_order_value: true,
      usage_limit: true,
      start_date: true,
      end_date: true,
      is_active: true,
    },
  });

  if (!voucher) {
    throw new Error("Không có voucher");
  }

  if (!voucher.is_active) {
    throw new Error("Voucher không hoạt động");
  }

  const now = new Date();

  if (voucher.start_date && now < voucher.start_date) {
    throw new Error("Voucher chưa bắt đầu");
  }

  if (voucher.end_date && now > voucher.end_date) {
    throw new Error("Voucher đã hết hạn");
  }

  if (total < voucher.min_order_value.toNumber()) {
    throw new Error("Chưa đạt giá trị tối thiểu");
  }

  if (voucher.usage_limit !== null) {
    const usedCount = await prisma.order.count({
      where: { voucherId: voucher.id },
    });

    if (usedCount >= voucher.usage_limit) {
      throw new Error("Voucher đã hết lượt sử dụng");
    }
  }

  const userUsed = await prisma.order.findFirst({
    where: {
      voucherId: voucher.id,
      userId,
    },
  });

  if (userUsed) {
    throw new Error("Bạn đã sử dụng voucher này rồi");
  }

  return voucher;
};

const toggleVoucherActive = async (id: number, isActive: boolean) => {
  return await prisma.voucher.update({
    where: { id },
    data: { is_active: isActive },
    select: {
      id: true,
      code: true,
    },
  });
};

const voucherModel = {
  checkCode,
  getVouchers,
  createVoucher,
  getVoucherById,
  findVoucherById,
  getVoucherByCode,
  updateVoucherById,
  deleteVoucherById,
  checkCodeExcludeId,
  toggleVoucherActive,
};

export default voucherModel;
