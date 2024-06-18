import { Tag } from 'antd';

import useApp from '@/hooks/use-app';

import { TRequestMethod } from '../project.model';

const RequestMethodTag = ({ method }: { method: TRequestMethod }) => {
  const { token } = useApp();

  return (
    <Tag
      color={
        method === 'GET'
          ? token.colorInfo
          : method === 'POST'
            ? token.colorSuccess
            : method === 'PUT'
              ? token.colorWarning
              : method === 'DELETE'
                ? token.colorError
                : 'default'
      }
    >
      {method}
    </Tag>
  );
};

export default RequestMethodTag;
