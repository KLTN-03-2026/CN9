import { FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ButtonBackProps {
  onClick?: () => void;
}

function ButtonBack({ onClick }: ButtonBackProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };
  return (
    <button
      className="flex items-center hover: cursor-pointer mt-2"
      onClick={handleClick}
    >
      <FaLongArrowAltLeft />
      <p className="ml-2">Quay lại</p>
    </button>
  );
}

export default ButtonBack;
