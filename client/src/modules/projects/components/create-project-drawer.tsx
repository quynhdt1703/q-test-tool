import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import { Button, Divider, Drawer, Form, Input, InputNumber, Space } from 'antd';

import useApp from '@/hooks/use-app';
import { inputIntKeyDown } from '@/shared/utils';

import { TCreateProjectDto } from '../project.model';
import projectService from '../project.service';

type TCreateProjectDrawer = {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => Promise<any>;
};

const CreateProjectDrawer: React.FC<TCreateProjectDrawer> = ({
  open,
  setOpen,
  refetch,
}: TCreateProjectDrawer) => {
  const { antdApp } = useApp();

  const [form] = Form.useForm<TCreateProjectDto>();

  const createMutation = useMutation({
    mutationFn: (data: TCreateProjectDto) => projectService.create(data),
    onSuccess: async () => {
      await refetch();
      antdApp.message.success('Tạo dự án thành công');
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
      title="Tạo dự án mới"
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
      <Form
        form={form}
        name="create-project"
        autoComplete="off"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{
          stages: [],
          envs: [],
        }}
        onFinish={(values) => {
          createMutation.mutate({
            ...values,
          });
        }}
      >
        <Form.Item<TCreateProjectDto>
          name="name"
          label="Tên dự án"
          required
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<TCreateProjectDto> name="description" label="Mô tả">
          <Input.TextArea />
        </Form.Item>

        <Divider />

        <Form.Item label="Kịch bản" wrapperCol={{ span: 24 }}>
          <Form.List name="stages">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <>
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
                  </>
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
    </Drawer>
  );
};

export default CreateProjectDrawer;
