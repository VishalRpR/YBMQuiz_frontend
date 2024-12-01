export const Input2box = ({
  lable,
  placeholder,
  onChange,
}: {
  lable: string;
  placeholder: string;
  onChange: (e: any) => void;
}) => {
  return (
    <div className="py-3 w-full">
      <div className="font-semibold py-1">{lable}</div>

      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="px-4 py-2 w-full border border-slate-700 bg-transparent rounded-sm "
      />
    </div>
  );
};
