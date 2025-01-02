import { gothamMedium } from "@/constants/fonts";

interface MenuProps {
  handleLogout: () => void;
}

const Menu = ({ handleLogout }: MenuProps) => {
  return (
    <div className="bg-bvDarkBlack absolute min-w-[200px] top-14 right-2.5 rounded-[8px] shadow-lg z-[1]">
      <button className="w-full text-left px-4 py-2" onClick={handleLogout}>
        <span className={`text-sm ${gothamMedium.className}`}>Log out</span>
      </button>
    </div>
  );
};

export default Menu;
