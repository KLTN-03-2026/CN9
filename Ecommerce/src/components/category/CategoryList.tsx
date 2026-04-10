import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CategoryType } from "../../types/CategoryType";

interface CategoryListProps {
  searchCategory: string;
  dataCategory: CategoryType[];
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIdCategory: React.Dispatch<React.SetStateAction<number | null>>;
}

function CategoryList({
  searchCategory,
  dataCategory,
  setIsOpenModal,
  setIdCategory,
}: CategoryListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-muted-light dark:text-text-muted-dark uppercase bg-background-light dark:bg-background-dark/50">
          <tr>
            <th className="px-6 py-3" scope="col">
              Hình ảnh
            </th>
            <th className="px-6 py-3" scope="col">
              Tên thể loại
            </th>
            <th className="px-6 py-3" scope="col">
              Mô tả
            </th>
            <th className="px-6 py-3 text-right" scope="col">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {dataCategory.map((category) => {
            return (
              <tr className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark">
                <td className="px-6 py-4">
                  <img
                    src={
                      String(category.imageCategory) ||
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBD3dOK_tOewsaN4HBLx8WCc3YTOXhMKZbdo2F7oqmv1dHY0pS6yKePRpsr9s4GQgvChRaIe2RTmLb0G4NDE6x7Oi14dG-_av5C1bHTkd7VuXMpxWTL06Hsqr1ePNbZN-kUuow-jZAGuHv4bXjA9OvHAu65dWxAXsonp4gB-QihjdCEBknPE2JprOY9YBedbL9yVil2syNoOmqnQqgU6lQJeb2vdf7Jy2JmsPmdOUpNtQgZZYO93J754w0cYd5GmAspDXsAntU9fcQ"
                    }
                    alt="The loai"
                    className="w-16 h-16 rounded-lg bg-cover bg-center"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-text-light dark:text-text-dark">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-text-muted-light dark:text-text-muted-dark max-w-sm truncate">
                  {category.description}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      className="p-2 rounded-lg hover:bg-primary/10 text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark"
                      onClick={() => {
                        setIsOpenModal(true);
                        setIdCategory(category.id);
                      }}
                    >
                      <MdOutlineModeEdit className="text-xl" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-danger/10 text-danger">
                      <RiDeleteBin6Line className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default CategoryList;
