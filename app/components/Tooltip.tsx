export const Tooltip = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black bg-opacity-30 text-white text-xs rounded py-1 px-2">
        {text}
      </div>
    </div>
  )
}