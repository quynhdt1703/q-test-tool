import { useMutation } from '@tanstack/react-query';
import { Button, Drawer, Form, Space } from 'antd';

import useApp from '@/hooks/use-app';

import { TAddRequestDto } from '../project.model';
import projectService from '../project.service';
import RequestFormBase from './request-form-base';

type TAddRequestDrawerProps = {
  projectId: string;
  initialValues?: TAddRequestDto;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => Promise<any>;
};

const AddRequestDrawer: React.FC<TAddRequestDrawerProps> = ({
  projectId,
  initialValues,
  open,
  setOpen,
  refetch,
}: TAddRequestDrawerProps) => {
  const { antdApp } = useApp();

  const [form] = Form.useForm<TAddRequestDto>();

  const createMutation = useMutation({
    mutationFn: (data: TAddRequestDto) =>
      projectService.addRequest(projectId, data),
    onSuccess: async () => {
      await refetch();
      antdApp.message.success('Thêm request thành công');
      setOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  return (
    <Drawer
      forceRender
      title="Thêm request mới"
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{'Hủy'}</Button>

          <Button
            type="primary"
            loading={createMutation.isPending}
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
        action="add"
        form={form}
        initialValues={initialValues}
        onFinish={(values) => {
          createMutation.mutate(values);
        }}
      />
    </Drawer>
  );
};

export default AddRequestDrawer;
