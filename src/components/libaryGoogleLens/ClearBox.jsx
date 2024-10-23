
import { ResizeHandle } from './ResizeHandle';
import './ClearBox.css';




export const ClearBox = ({ boxPosition, boxSize, onDragStart, onResizeStart,animateClearBox }) => (
  <div
    aria-label="ini adalah kotak clear"
    className={`absolute  ${animateClearBox ? 'animate-clear-box' : ''}`}
    style={{
      left: boxPosition.x,
      top: boxPosition.y,
      width: boxSize.width,
      height: boxSize.height,
    }}
  >
    <div
      style={{ width: '100%', height: '100%', cursor: 'move', position: 'relative' }}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
    >
      {['nw', 'ne', 'sw', 'se'].map(position => (
        <ResizeHandle 
          key={position} 
          position={position} 
          onMouseDown={onResizeStart(position)} 
        />
      ))}
    </div>
  </div>
);

