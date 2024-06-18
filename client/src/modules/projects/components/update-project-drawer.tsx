import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Skeleton,
  Space,
} from 'antd';
import { useEffect } from 'react';

import useApp from '@/hooks/use-app';
import { inputIntKeyDown } from '@/shared/utils';

import useGetProject from '../hooks/use-get-project';
import { TUpdateProjectDto } from '../project.model';
import projectService from '../project.service';

type TUpdateProjectDrawer = {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetchList?: () => Promise<any>;
};

const UpdateProjectDrawer: React.FC<TUpdateProjectDrawer> = ({
  id,
  open,
  setOpen,
  refetchList,
}: TUpdateProjectDrawer) => {
  const { antdApp } = useApp();

  const [form] = Form.useForm<TUpdateProjectDto>();

  const projectQuery = useGetProject(id);

  const mutation = useMutation({
    mutationFn: (data: TUpdateProjectDto) => projectService.update(id, data),
    onSuccess: async () => {
      await refetchList?.();
      await projectQuery.refetch();

      antdApp.message.success('Cập nhật thông tin dự án thành công');
      setOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  useEffect(() => {
    if (projectQuery.isSuccess) {
      form.setFieldsValue(projectQuery.data);
    }
  }, [form, projectQuery.data, projectQuery.isSuccess]);

  return (
    <Drawer
      forceRender
      title="Chỉnh sửa thông tin dự án"
      open={open}
      onClose={() => setOpen(false)}
      width={600}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{'Hủy'}</Button>

          <Button
            type="primary"
            loading={mutation.isPending}
            onClick={() => {
              form.submit();
            }}
          >
            {'Lưu'}
          </Button>
        </Space>
      }
    >
      {projectQuery.isLoading ? (
        <Skeleton />
      ) : (
        <Form
          form={form}
          name="update-project"
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={projectQuery.data}
          onFinish={(values) => {
            mutation.mutate({
              ...values,
            });
          }}
        >
          <Form.Item<TUpdateProjectDto>
            name="name"
            label="Tên dự án"
            required
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<TUpdateProjectDto> name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>

          <Divider />

          <Form.Item label="Kịch bản" wrapperCol={{ span: 24 }}>
            <Form.List name="stages">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...rest }) => (
                    <Space
                      key={key}
                      css={css`
                        display: flex;
                      `}
                      align="baseline"
                    >
                      <Form.Item
                        {...rest}
                        name={[name, 'vus']}
                        required
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          placeholder="VUS"
                          onKeyDown={inputIntKeyDown}
                          addonAfter="VU"
                        />
                      </Form.Item>

                      <Space
                        css={css`
                          justify-self: end;
                        `}
                        align="baseline"
                      >
                        <Form.Item
                          {...rest}
                          name={[name, 'duration']}
                          required
                          rules={[{ required: true }]}
                        >
                          <InputNumber
                            placeholder="Thời gian"
                            onKeyDown={inputIntKeyDown}
                            addonAfter="giây"
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    </Space>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      {'Thêm kịch bản'}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Divider />

          <Form.Item label="Biến" wrapperCol={{ span: 24 }}>
            <Form.List name="envs">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...rest }) => (
                    <Space
                      key={key}
                      css={css`
                        display: flex;
                      `}
                      align="baseline"
                    >
                      <Form.Item
                        {...rest}
                        name={[name, 'name']}
                        required
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Name" />
                      </Form.Item>

                      <Form.Item
                        {...rest}
                        name={[name, 'value']}
                        required
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Value" />
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      {'Thêm biến'}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default UpdateProjectDrawer;
