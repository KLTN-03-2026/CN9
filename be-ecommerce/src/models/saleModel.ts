import prisma from "../PrismaClient";
import SaleType from "../types/SaleType";

const createSale = async (data: SaleType) => {
  return await prisma.sale.create({
    data,
  });
};

const getAllSales = async (search?: string, skip = 0, take = 10) => {
  const where = search ? { name_sale: { contains: search } } : {};

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      skip,
      take,
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.sale.count({ where }),
  ]);

  return {
    data: sales.map(({ name_sale, is_active, ...rest }) => ({
      ...rest,
      name: name_sale,
      isActive: is_active,
    })),
    total,
  };
};

const getActiveSales = async () => {
  const now = new Date();
  return await prisma.sale.findMany({
    where: {
      is_active: true,
      OR: [
        {
          start_date: null,
          end_date: null,
        },
        {
          start_date: { lte: now },
          end_date: { gte: now },
        },
        {
          start_date: { lte: now },
          end_date: null,
        },
        {
          start_date: null,
          end_date: { gte: now },
        },
      ],
    },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
};

const getSaleById = async (id: number) => {
  const sale = await prisma.sale.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (!sale) {
    throw new Error("Sale not found");
  }

  const { name_sale, ...rest } = sale;

  return { ...rest, name: name_sale };
};

const updateSaleById = async (id: number, data: Partial<SaleType>) => {
  return await prisma.sale.update({
    where: { id },
    data,
  });
};

const deleteSaleById = async (id: number) => {
  return await prisma.sale.delete({
    where: { id },
  });
};

const toggleSaleActive = async (id: number, isActive: boolean) => {
  return await prisma.sale.update({
    where: { id },
    data: { is_active: isActive },
    select: { id: true },
  });
};

const saleModel = {
  createSale,
  getAllSales,
  getSaleById,
  getActiveSales,
  updateSaleById,
  deleteSaleById,
  toggleSaleActive,
};

export default saleModel;
