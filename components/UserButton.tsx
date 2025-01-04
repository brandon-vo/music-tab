import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { User } from "@/types/User";

interface UserButtonProps {
  userProfile: User | null;
  toggleMenu: () => void;
  menuOpen: boolean;
}

const UserButton = ({ userProfile, toggleMenu, menuOpen }: UserButtonProps) => {
  return (
    <button
      className="absolute top-2.5 right-2.5 flex justify-center rounded-3xl text-bvWhite px-8 py-1.5 z-[2]"
      onClick={toggleMenu}
    >
      <div className="flex items-center">
        <img
          src={userProfile?.images[0]?.url || "images/blank.png"}
          alt={userProfile?.display_name || "User"}
          className="w-[28px] h-[28px] rounded-[20px] absolute left-[3px]"
        />
        <span className={`text-sm font-semibold pl-[10px]`}>
          {userProfile?.display_name || "You"}
        </span>
        {menuOpen ? (
          <FaCaretUp className="w-[15px] h-[15px] absolute right-[12px] bottom-[8px]" />
        ) : (
          <FaCaretDown className="w-[15px] h-[15px] absolute right-[12px] bottom-[8px]" />
        )}
      </div>
    </button>
  );
};

export default UserButton;
