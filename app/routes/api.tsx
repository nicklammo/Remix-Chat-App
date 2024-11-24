export default function API({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>API:</div>
      <div>{children}</div>
    </>
  )
}