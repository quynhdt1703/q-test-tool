import { Flex, Progress } from 'antd';
import { useState } from 'react';
import { useInterval } from 'react-use';

const SpinTimer = ({
  time,
  onTimeout,
}: {
  time: number;
  onTimeout: () => void;
}) => {
  const [seconds, setSeconds] = useState(time);

  useInterval(() => {
    if (seconds === 0) {
      onTimeout();
      return;
    }
    setSeconds(seconds - 1);
  }, 1000);

  return (
    <Flex vertical justify="center" align="center" gap={16}>
      <Progress
        type="circle"
        percent={(seconds / time) * 100}
        format={() => `${seconds} giây`}
      />
    </Flex>
  );
};

export default SpinTimer;
