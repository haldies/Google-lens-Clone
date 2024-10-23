
export const ResizeHandle = ({ position, onMouseDown }) => (
  
  <div
    className={`absolute w-6 h-6  overflow-hidden  cursor-${position}-resize`}
    style={getPositionStyle(position)}
    onMouseDown={onMouseDown}
  >
    <div className="h-[50px] w-[50px] absolute  border-[6px] border-white   rounded-xl" style={getInnerStyle(position)} />
  </div>
);

const getPositionStyle = (position) => {
  switch (position) {
    case 'nw': return { top: -6, left: -6 };
    case 'ne': return { top: -6, right: -6 };
    case 'sw': return { bottom: -6, left: -6 };
    case 'se': return { bottom: -6, right: -6 };
  }
};

const getInnerStyle = (position) => {
  switch (position) {
    case 'ne': return { right: 0 };
    case 'sw': return { left: 0, bottom: 0 };
    case 'se': return { right: 0, bottom: 0 };
    default: return {};
  }
};