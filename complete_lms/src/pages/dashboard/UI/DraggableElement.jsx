import React, { useState, useRef, useEffect, useContext } from 'react';
import { CertificateContext } from '../../../contexts/CertificateContext';

const DraggableElement = ({ id, children, defaultPosition, isDisabled = false }) => {
  const { updateElementPosition } = useContext(CertificateContext);
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  const containerRef = useRef(document.querySelector('.certificate-template'));

  const handleMouseDown = (e) => {
    if (isDisabled) return;
    
    setIsDragging(true);
    const rect = elementRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isDisabled) return;
    
    if (!containerRef.current) {
      containerRef.current = document.querySelector('.certificate-template');
      if (!containerRef.current) return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const elementRect = elementRef.current.getBoundingClientRect();
    
    // Calculate new position with full container bounds
    let newX = e.clientX - containerRect.left - offset.x;
    let newY = e.clientY - containerRect.top - offset.y;
    
    // Allow dragging to edges by considering element width/height
    newX = Math.max(0, Math.min(newX, containerRect.width - elementRect.width));
    newY = Math.max(0, Math.min(newY, containerRect.height - elementRect.height));
    
    const newPosition = { x: newX, y: newY };
    
    setPosition(newPosition);
    updateElementPosition(id, newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, offset]);

  const style = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    cursor: isDragging ? 'grabbing' : (isDisabled ? 'default' : 'grab'),
    zIndex: isDragging ? 1000 : 1
  };

  return (
    <div
      ref={elementRef}
      id={id}
      style={style}
      onMouseDown={handleMouseDown}
      className="draggable-element"
    >
      {children}
    </div>
  );
};

export default DraggableElement;