import { MdOutlineEdit } from "react-icons/md";

interface ButtonIconEditProps {
  onClick?: () => void;
}

function ButtonIconEdit({ onClick }: ButtonIconEditProps) {
  return (
    <button className="p-2 rounded-md hover:bg-primary/20" onClick={onClick}>
      <MdOutlineEdit className="text-lg" />
    </button>
  );
}

export default ButtonIconEdit;
