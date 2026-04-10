import { IoMdNotificationsOutline } from "react-icons/io";

interface HeaderPageProps {
  title: string;
  content: string;
  component?: React.ReactNode;
}

function HeaderPage({ title, content, component }: HeaderPageProps) {
  return (
    <header className="flex items-center justify-between pb-6 border-b border-border-light dark:border-border-dark">
      <div className="flex flex-col w-3/4">
        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
          {title}
        </h1>
        <p className="text-sm font-normal text-text-muted-light dark:text-text-muted-dark">
          {content}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {!component ? (
          <button className="relative p-2 rounded-full hover:bg-primary/20">
            <IoMdNotificationsOutline size={22} />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
            </span>
          </button>
        ) : (
          component
        )}
      </div>
    </header>
  );
}

export default HeaderPage;
