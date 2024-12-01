export const Primarybutton = ({
  lable,
  type,
  onClick,
}: {
  lable: string;
  type: "small" | "big";
  onClick: () => void;
}) => {
  return (
    <div
      className={`rounded-full text-white font-bold cursor-pointer bg-slate-700 hover:bg-slate-900 text-center ${
        type == "small" ? "text-sm px-5 py-2" : "text-xl px-10 py-3"
      }`}
      onClick={onClick}
    >
      {lable}
    </div>
  );
};
