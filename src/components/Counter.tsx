import React, { useState } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
}

export default function Counter({ initialValue = 0, step = 1 }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  const reset = () => setCount(initialValue);

  return (
    <div className="counter">
      <h2>Counter: {count}</h2>
      <div className="buttons">
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
