import { Carousel } from "antd";

import img1 from "../../assets/images/slide_1_img.jpg";
import img2 from "../../assets/images/slide_2_img.jpg";
import img3 from "../../assets/images/slide_3_img.jpg";
import img4 from "../../assets/images/slide_4_img.jpg";

import img_nam from "../../assets/images/nam.png";
import img_nu from "../../assets/images/nu.png";
import img_unisex from "../../assets/images/unisex.png";

import FeaturedProdustList from "../../components/home/FeaturedProdustList";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="flex-1">
      <Carousel autoplay className="mb-20 px-10">
        <div className="relative w-full h-[70vh] overflow-hidden">
          <img
            src={img1}
            alt=""
            className="absolute inset-0 bg-cover bg-center"
          />
        </div>
        <div className="relative w-full h-[70vh] overflow-hidden">
          <img
            src={img2}
            alt=""
            className="absolute inset-0 bg-cover bg-center"
          />
        </div>
        <div className="relative w-full h-[70vh] overflow-hidden">
          <img
            src={img3}
            alt=""
            className="absolute inset-0 bg-cover bg-center"
          />
        </div>
        <div className="relative w-full h-[70vh] overflow-hidden">
          <img
            src={img4}
            alt=""
            className="absolute inset-0 bg-cover bg-center"
          />
        </div>
      </Carousel>
      <section className="px-6 md:px-12 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to={"/category/nam"}
            className="relative aspect-[3/4] overflow-hidden group rounded-2xl"
          >
            <img
              src={img_nam}
              alt=""
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl font-light mb-2">Dành cho Nam</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest border-b border-white/50 pb-1">
                Xem chi tiết
              </span>
            </div>
          </Link>
          <Link
            to={"/category/nu"}
            className="relative aspect-[3/4] overflow-hidden group rounded-2xl"
          >
            <img
              src={img_nu}
              alt=""
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl font-light mb-2">Dành cho Nữ</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest border-b border-white/50 pb-1">
                Xem chi tiết
              </span>
            </div>
          </Link>
          <Link
            to={"/category/unisex"}
            className="relative aspect-[3/4] overflow-hidden group rounded-2xl"
          >
            <img
              src={img_unisex}
              alt=""
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl font-light mb-2">Unisex</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest border-b border-white/50 pb-1">
                Xem chi tiết
              </span>
            </div>
          </Link>
        </div>
      </section>
      <FeaturedProdustList />
      <section className="bg-neutral-light py-10">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light tracking-tight text-primary uppercase">
              Khách hàng nói gì
            </h2>
            <p className="text-text-muted text-sm mt-3 uppercase tracking-widest italic">
              Trải nghiệm mua sắm tại Minimal
            </p>
            <div className="mt-6 w-12 h-px bg-primary mx-auto" />
          </div>
          <div className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
            <div className="flex-none w-full md:w-[400px] bg-white p-10 rounded-lg shadow-sm snap-center border border-neutral-gray/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-0.5 mb-6 text-amber-500">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                </div>
                <p className="text-lg leading-relaxed text-text-main mb-8">
                  "Chất lượng vải thực sự tuyệt vời. Form dáng tối giản nhưng
                  lại rất sang trọng, phù hợp cho cả đi làm và dạo phố. Tôi hài
                  rất lòng với sự lựa chọn này."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-gray flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-text-muted">
                    person
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest">
                    Khánh Linh
                  </h4>
                  <p className="text-[10px] text-text-muted uppercase tracking-tighter mt-0.5">
                    Fashion Designer
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-none w-full md:w-[400px] bg-white p-10 rounded-lg shadow-sm snap-center border border-neutral-gray/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-0.5 mb-6 text-amber-500">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                </div>
                <p className="text-lgleading-relaxed text-text-main mb-8">
                  "Dịch vụ chăm sóc khách hàng rất chu đáo. Giao hàng nhanh và
                  đóng gói rất tinh tế. Đây chắc chắn là thương hiệu yêu thích
                  mới của tôi."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-gray flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-text-muted">
                    person
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest">
                    Minh Quân
                  </h4>
                  <p className="text-[10px] text-text-muted uppercase tracking-tighter mt-0.5">
                    Khách hàng thân thiết
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
