import { useEffect, useState } from "react";

import { getAllCategory } from "../../api/categoryApi";

import { Link } from "react-router-dom";
import { getCategoriesBySlugGender } from "../../api/genderApi";
import type { CategoryType } from "../../type/CategoryType";

interface CategoryListProps {
  slug?: string;
}

function CategoryList({ slug }: CategoryListProps) {
  const [dataCategory, setDataCategory] = useState<CategoryType[]>([]);

  const getdataCategories = async () => {
    try {
      const resCategory = await getAllCategory();
      setDataCategory(resCategory.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getDataCategoriesBySlugGender = async (slug: string) => {
    try {
      const resCategory = await getCategoriesBySlugGender(slug);
      setDataCategory(resCategory.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (slug) {
      getDataCategoriesBySlugGender(slug);
    } else {
      getdataCategories();
    }
  }, [slug]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dataCategory.map((category) => {
          return (
            <Link
              key={category.id}
              to={"/collections/" + category.slug}
              className="group relative block overflow-hidden rounded-xl"
            >
              <img
                className="aspect-[3/4] bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                src={category.imageCategory}
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex items-end p-4">
                <p className="text-white text-lg font-bold leading-tight">
                  {category.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryList;
