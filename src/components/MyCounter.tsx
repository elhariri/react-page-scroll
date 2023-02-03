import React, { useState } from 'react';

interface Props {
  value?: number;
}

const MyCounter = ({ value = 0 }: Props): React.ReactNode => {
  const [counter, setCounter] = useState(value);

  const onMinus = (): void => {
    setCounter((prev) => prev - 1);
  };

  const onPlus = (): void => {
    setCounter((prev) => prev + 1);
  };

  return (
    <div>
      <h1>Counter: {counter}</h1>
      <button onClick={onMinus}>-</button>
      <button onClick={onPlus}>+</button>
    </div>
  );
};

export default MyCounter;
