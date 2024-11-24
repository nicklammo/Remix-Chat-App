import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import IconDotsVertical from "~/icons/DotsVertical";

export const ConversationsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ResizableBox
      width={400}
      height={Infinity}
      minConstraints={[400, Infinity]}
      axis="x"
      handle={
        <div className="custom-handle absolute top-0 right-0 p-2 h-full flex flex-col">
          <div className="w-1rem bg-gray-800 h-full cursor-col-resize flex flex-col justify-center rounded">
            <IconDotsVertical />
          </div>
        </div>}
    >
      <div
        className="min-w-[400px] h-full flex flex-col px-2 py-2 overflow-auto pr-8"
      >
        {children}
      </div>
    </ResizableBox>

  )
}