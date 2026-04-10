interface ButtonProps {
  title: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
}

function Button({ title, icon, onClick, className = "" }: ButtonProps) {
  return (
    <button
      className={`flex w-auto items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg  ${
        className
          ? className
          : "bg-primary text-background-dark hover:opacity-90"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
}

export default Button;
