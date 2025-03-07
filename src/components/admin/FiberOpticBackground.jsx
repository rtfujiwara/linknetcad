
import React from "react";

export const FiberOpticBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.2)_0%,rgba(37,99,235,0.3)_100%)]"></div>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-[3px] bg-blue-500"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 200 + 100}px`,
            transform: `rotate(${Math.random() * 360}deg)`,
            opacity: Math.random() * 0.7 + 0.3,
            boxShadow: '0 0 15px rgba(59,130,246,0.8)',
          }}
        ></div>
      ))}
    </div>
  );
};

export default FiberOpticBackground;
