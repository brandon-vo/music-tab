import { gothamMedium } from "@/constants/fonts";
import { useRouter } from "next/navigation";

interface MenuProps {
  handleLogout: () => void;
}

const Menu = ({ handleLogout }: MenuProps) => {
  // todo try using link again. link isnt styling properly
  const router = useRouter();

  const redirectToSettings = () => {
    router.push("/settings");
  };

  return (
    <div className="bg-bvDarkBlack absolute w-[150px] top-14 right-2.5 rounded-[8px] shadow-lg z-[3]">
      <button
        onClick={redirectToSettings}
        className={`w-full text-left px-4 hover:rounded-b-none rounded-md`}
      >
        <span className={`text-sm ${gothamMedium.className}`}>Settings</span>
      </button>
      {/* <button className="w-full text-left px-4 py-2 hover:rounded-none" onClick={() => alert('hi')}>
        <span className={`text-sm ${gothamMedium.className}`}>About</span>
      </button> */}
      <button
        className="w-full text-left px-4 hover:rounded-t-none rounded-md"
        onClick={handleLogout}
      >
        <span className={`text-sm ${gothamMedium.className}`}>Log out</span>
      </button>
    </div>
  );
};

export default Menu;
