export const MainContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="w-screen h-screen flex flex-row gap-1">
      {children}
    </div>
  )
}