export const Inputbox = ({
  lable,
  onChange,
  value
}: {
  lable: string;
  placeholder: string;
  onChange: (e: any) => void;
  value:string
}) => {
  return (
    <div className="py-3 w-full">
      <div className="font-semibold py-1">{lable}</div>

      <textarea
        value={value}
        
        onChange={onChange}
        className="px-4 py-2 w-full border border-slate-700 bg-transparent rounded-sm "
      
      />
    </div>
  );
};
