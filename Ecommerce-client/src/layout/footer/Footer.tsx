function Footer() {
  return (
    <footer className="bg-card-light dark:bg-card-dark border-t border-border-light dark:border-border-dark mt-10">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Về chúng tôi
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  className="text-base text-text-light/80 dark:text-text-dark/80 hover:text-primary"
                  href="#"
                >
                  Câu chuyện
                </a>
              </li>
              <li>
                <a
                  className="text-base text-text-light/80 dark:text-text-dark/80 hover:text-primary"
                  href="#"
                >
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a
                  className="text-base text-text-light/80 dark:text-text-dark/80 hover:text-primary"
                  href="#"
                >
                  Báo chí
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Hỗ trợ
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  className="text-base text-text-light/80 dark:text-text-dark/80 hover:text-primary"
                  href="#"
                >
                  Liên hệ
                </a>
              </li>
              <li>
                <a
                  className="text-base text-text-light/80 dark:text-text-dark/80 hover:text-primary"
                  href="#"
                >
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a
                  className="text-base text-text-light/80 dark:text-text-dark/80 hover:text-primary"
                  href="#"
                >
                  Chính sách trả hàng
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Chính sách
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  className="text-base text-text-light/80 dark:text-text-dark/80 hover:text-primary"
                  href="#"
                >
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  className="text-base text-text-light/80 dark:text-text-dark/80 hover:text-primary"
                  href="#"
                >
                  Điều khoản dịch vụ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Theo dõi chúng tôi
            </h3>
            <div className="flex mt-4 space-x-4"></div>
          </div>
        </div>
        <div className="mt-8 border-t border-border-light dark:border-border-dark pt-8 text-center">
          <p className="text-base text-text-light/70 dark:text-text-dark/70">
            © 2024 BrandName. Đã đăng ký bản quyền.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
