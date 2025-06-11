import React, { useState, useRef, useEffect } from 'react';
import './DraggableElement.css';

const DraggableElement = ({ 
  id, 
  children, 
  defaultPosition = { x: 0, y: 0 },
  bounds = 'parent'
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setPosition(defaultPosition);
  }, [defaultPosition]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = elementRef.current.getBoundingClientRect();
    startPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const container = bounds === 'parent' 
      ? elementRef.current.parentElement 
      : document.querySelector(bounds);
      
    const containerRect = container.getBoundingClientRect();
    const elementRect = elementRef.current.getBoundingClientRect();
    
    let newX = e.clientX - containerRect.left - startPos.current.x;
    let newY = e.clientY - containerRect.top - startPos.current.y;
    
    // Constrain to container bounds
    newX = Math.max(0, Math.min(containerRect.width - elementRect.width, newX));
    newY = Math.max(0, Math.min(containerRect.height - elementRect.height, newY));
    
    setPosition({
      x: (newX / containerRect.width) * 100,
      y: (newY / containerRect.height) * 100
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const style = {
    position: 'absolute',
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: 'translate(-50%, -50%)',
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 100 : 10
  };

  return (
    <div
      ref={elementRef}
      className={`draggable-element ${isDragging ? 'dragging' : ''}`}
      style={style}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

export default DraggableElement;