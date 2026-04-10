function RelatedProducts() {
  return (
    <div className="mt-16 lg:mt-20">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Có thể bạn cũng thích
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {/* Product Card 1 */}
        <div className="flex flex-col gap-3 group">
          <div className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg overflow-hidden">
            <div
              className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-300"
              data-alt="Relaxed fit linen shirt"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAKAh_heSKwOcc0BwYpSQBw20K8UlJplfZ1e668C_p4opmr1hPdv8oIF2Vql7KeoMQ_Iu1B1NU_m60mUI00USZFHQQR525HkgznHLRWPD4FdQOD9jU5VmnUmC-dMh-CcmpZrYHA73vSJngjV6OnsSAG4bpAWrJspwWkCZGPTzUK02Zv-tPbMLZC7LaFM0--aCBV4RvF4pCXNUYUKs1CooZG4KIEIuvmG1Y3aL1We4OloBKM3VDX8oBXCh3p5lYQ3SJ6M0pgYY3C9gc")',
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              Áo sơ mi Linen
            </h3>
            <p className="text-primary font-medium">550.000₫</p>
          </div>
        </div>
        {/* Product Card 2 */}
        <div className="flex flex-col gap-3 group">
          <div className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg overflow-hidden">
            <div
              className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-300"
              data-alt="Classic denim jeans"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuByq1mJlwWVOT6giXdomXybZV2FmMr2WLTBBByuSuh9uSZYjnlmSyGW8jufrB1PuvyVNhjL87PsJUa-WfNuldnjMlakepRia5QPxxRwOBssbF28DaVMTah12ZSjPFejuT55U5Ol7ZGEngZyRDGRRg9f55IqAAgQcUHiDb6OxizBZYcwQco51th-bQyk0qQN9XC_q7s5kBKUe5A3jtyh-yFBH3LaDHYgxzxyxO8YRtHg0v_WH9CU81Z-v8FG1P3yx9gwmeB42mbDUJ0")',
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              Quần Jeans Cổ điển
            </h3>
            <p className="text-primary font-medium">790.000₫</p>
          </div>
        </div>
        {/* Product Card 3 */}
        <div className="flex flex-col gap-3 group">
          <div className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg overflow-hidden">
            <div
              className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-300"
              data-alt="Casual chino shorts"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuApPZbiGWAILsKRvy0CLUVorbF7dEyXj0gw_Jl1vr6II7psRLun-QHaeTfk_b0EVeKuCB7WfNxlBAp8yiTVuU_0Sb-E3QFejY0GtphJrKD9o08_k-u2IzBO8S3pL_YCT_9y0UCx2y-fpOv3Bo5fYjn8fIFDAho-Cm_0MqqodEGb1WxLn4o7CYOD89AwCnRRbPMo0X55tmZ-MnR9JGmL7OpbHFJMShlycWDvUxdKYAobkIpIIsUImKTjtevRgELwf-whh6LnANgMIrE")',
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              Quần short Chino
            </h3>
            <p className="text-primary font-medium">420.000₫</p>
          </div>
        </div>
        {/* Product Card 4 */}
        <div className="flex flex-col gap-3 group">
          <div className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg overflow-hidden">
            <div
              className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-300"
              data-alt="Minimalist white sneakers"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAHFBupMuyX_ong3_bQiCshJv-GNdYQKLwoP8vSHlbANStNG91wR--ZBBeTBsl0Ht-UqFK6FFi1bi8C8qC8j5R9KYQbyg22d8Ws-6sjDBu-dTGZ_usGo4iHmQvKVTFuWrJuybAkoFc2KgeRPogA8Wv7RgKuXr6azN-eIX1dVnESFEdtK04hOs6VfUUOID-vIhlm_XQAGTAUYKMepxatYzXb9GemYpFz-Hx0zCdeZqTLFqaeeptyZsVsSS79-p-xtE4COWarmEt8EEU")',
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              Giày Sneaker Trắng
            </h3>
            <p className="text-primary font-medium">1.250.000₫</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RelatedProducts;
