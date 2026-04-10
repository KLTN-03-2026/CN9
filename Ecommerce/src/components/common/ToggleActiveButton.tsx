import { MdLockOpen, MdLockOutline } from "react-icons/md";

interface ToggleStatusButtonProps {
  isActive: boolean;
  onToggle: () => void;
}

const ToggleActiveButton = ({
  isActive,
  onToggle,
}: ToggleStatusButtonProps) => {
  return (
    <button
      onClick={onToggle}
      title={isActive ? "Khóa" : "Mở khóa"}
      className="p-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark"
    >
      {isActive ? (
        <MdLockOpen className="text-xl" />
      ) : (
        <MdLockOutline className="text-xl" />
      )}
    </button>
  );
};

export default ToggleActiveButton;
