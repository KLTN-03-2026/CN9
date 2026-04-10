import { useParams } from "react-router-dom";
import CategoryList from "../../components/category/CategoryList";

function CategoryPage() {
  const { slug } = useParams<{ slug?: string }>();

  return (
    <>
      <main className="container px-4 sm:px-10 lg:px-20 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[1280px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <h1 className="text-text-light dark:text-text-dark text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
              Khám Phá Phong Cách Của Bạn
            </h1>
          </div>
          <CategoryList slug={slug} />
        </div>
      </main>
    </>
  );
}

export default CategoryPage;
