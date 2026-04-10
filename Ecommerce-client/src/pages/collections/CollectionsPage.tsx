import { useEffect, useState, type ChangeEvent } from "react";
import CollectionsList from "../../components/collections/CollectionsList";
import { getAllColors } from "../../api/colorApi";
import { getAllSizes } from "../../api/sizeApi";
import { formatMoneyString } from "../../utils/formatPrice";
import { useParams } from "react-router-dom";
import type { ColorType } from "../../type/ColorType";
import type { SizeType } from "../../type/SizeType";

function CollectionsPage() {
  const { collectionKey } = useParams();

  const [inputCollections, setInputCollections] = useState<{
    price: number;
    color: number;
    size: number;
  }>({
    price: 2000000,
    color: 0,
    size: 0,
  });

  const [dataColors, setDataColors] = useState<ColorType[]>([]);

  const [dataSizes, setDataSizes] = useState<SizeType[]>([]);

  const getDataColorsAndSizes = async () => {
    try {
      const [resColors, resSizes] = await Promise.all([
        getAllColors(),
        getAllSizes(),
      ]);
      setDataColors(resColors.data);
      setDataSizes(resSizes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataColorsAndSizes();
  }, []);

  function handleInputChanger(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setInputCollections((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-32 space-y-10">
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-6">
                Khoảng giá (VNĐ)
              </h3>
              <div className="px-2">
                <input
                  className="w-full h-1 bg-slate-500 rounded-lg appearance-none cursor-pointer accent-primary"
                  max={2000000}
                  min={0}
                  step={10000}
                  type="range"
                  name="price"
                  onChange={handleInputChanger}
                  value={inputCollections.price}
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight px-2 py-1 bg-slate-50 border border-slate-100 rounded">
                    0đ
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight px-2 py-1 bg-slate-50 border border-slate-100 rounded">
                    {formatMoneyString(String(inputCollections.price))}đ
                  </span>
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-6">
                Màu sắc
              </h3>
              <div className="flex flex-wrap gap-3">
                {dataColors.map((color) => {
                  return (
                    <button
                      onClick={() => {
                        setInputCollections((prev) => ({
                          ...prev,
                          color: prev.color === color.id ? 0 : color.id,
                        }));
                      }}
                      style={{ backgroundColor: color.hex }}
                      className={`w-7 h-7 rounded-full border ${inputCollections.color === color.id ? "bg-white ring-2 ring-primary ring-offset-2" : ""}`}
                    />
                  );
                })}
              </div>
            </section>
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-6">
                Kích cỡ
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {dataSizes.map((size) => {
                  return (
                    <button
                      onClick={() => {
                        setInputCollections((prev) => ({
                          ...prev,
                          size: prev.size === size.id ? 0 : size.id,
                        }));
                      }}
                      key={size.id}
                      className={`py-2 text-[11px] font-bold border ${inputCollections.size === size.id ? "border-primary text-primary rounded bg-primary/5" : "border-slate-100 bg-white text-slate-600 rounded hover:border-primary hover:text-primary transition-all"} `}
                    >
                      {size.symbol}
                    </button>
                  );
                })}
              </div>
            </section>
            <button className="w-full py-4 bg-primary text-white text-[11px] font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity uppercase tracking-widest">
              Áp dụng lọc
            </button>
          </div>
        </aside>
        <CollectionsList collectionKey={collectionKey} />
      </div>
    </main>
  );
}

export default CollectionsPage;
