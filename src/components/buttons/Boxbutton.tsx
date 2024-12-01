export const Boxbutton = ({ lable }: { lable: string }) => {
  return (
    <div className="px-3 py-1 cursor-pointer hover:bg-slate-200 rounded-sm">
      {lable}
    </div>
  );
};
