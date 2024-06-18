import { useMutation } from '@tanstack/react-query';
import { Button, Drawer, Form, Space } from 'antd';

import useApp from '@/hooks/use-app';

import { TRequest, TUpdateRequestDto } from '../project.model';
import projectService from '../project.service';
import RequestFormBase from './request-form-base';

type TUpdateRequestDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  projectId: string;
  request: TRequest;
  refetch: () => Promise<any>;
};

const UpdateRequestDrawer = ({
  open,
  setOpen,
  request,
  projectId,
  refetch,
}: TUpdateRequestDrawerProps) => {
  const { antdApp } = useApp();

  const [form] = Form.useForm<TUpdateRequestDto>();

  const updateMutation = useMutation({
    mutationFn: (data: TUpdateRequestDto) =>
      projectService.updateRequest(projectId, request.id, data),
    onSuccess: async () => {
      await refetch();
      antdApp.message.success('Cập nhật request thành công');
      form.resetFields();
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  return (
    <Drawer
      forceRender
      title="Chỉnh sửa Request"
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{'Hủy'}</Button>

          <Button
            type="primary"
            loading={updateMutation.isPending}
            onClick={() => {
              form.submit();
            }}
          >
            {'Lưu'}
          </Button>
        </Space>
      }
    >
      <RequestFormBase
        action="update"
        form={form}
        initialValues={request}
        onFinish={(values) => {
          updateMutation.mutate(values);
        }}
      />
    </Drawer>
  );
};

export default UpdateRequestDrawer;
