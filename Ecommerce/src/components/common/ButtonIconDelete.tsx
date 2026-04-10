import { RiDeleteBin6Line } from "react-icons/ri";

interface ButtonIconDeleteProps {
  onClick?: () => void;
}

function ButtonIconDelete({ onClick }: ButtonIconDeleteProps) {
  return (
    <button
      className="p-1.5 rounded-full hover:bg-primary/20 text-danger"
      onClick={onClick}
    >
      <RiDeleteBin6Line className="text-lg" />
    </button>
  );
}

export default ButtonIconDelete;
