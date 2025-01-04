interface SwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  label: string;
}

const Switch = ({ isOn, handleToggle, label }: SwitchProps) => (
  <div className="flex justify-between items-center py-2">
    <span className="select-none">{label}</span>
    <div
      className={`relative w-14 h-8 flex items-center cursor-pointer ${
        isOn ? "bg-spotify" : "bg-gray-300"
      } rounded-full transition-all shadow-inner duration-300`}
      onClick={handleToggle}
    >
      <div
        className={`absolute w-7 h-7 bg-white rounded-full shadow-md transform-all 
          ${isOn ? "translate-x-6" : "translate-x-0"}`}
      />
    </div>
  </div>
);

export default Switch;
