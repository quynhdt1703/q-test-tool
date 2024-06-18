import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import {
  Button,
  Divider,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
} from 'antd';
import * as uuid from 'uuid';

import { inputIntKeyDown } from '@/shared/utils';

import { TAddRequestDto, TUpdateRequestDto } from '../project.model';

type TRequestFormBaseProps = {
  form: FormInstance<any>;
  onFinish: (values: any) => void;
  action: 'add' | 'update';
  initialValues?: TUpdateRequestDto;
};

const RequestFormBase = ({
  form,
  onFinish,
  action,
  initialValues,
}: TRequestFormBaseProps) => {
  return (
    <Form
      form={form}
      name={
        action === 'add'
          ? `add-request-form-${uuid.v4()}`
          : `update-request-form-${uuid.v4()}`
      }
      autoComplete="off"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={
        initialValues || {
          protocol: 'https',
          port: 443,
          path: '/',
          method: 'GET',
        }
      }
      onFinish={onFinish}
    >
      <Form.Item<TAddRequestDto | TUpdateRequestDto>
        name="name"
        label="Tên request"
        required
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<TAddRequestDto | TUpdateRequestDto>
        name="protocol"
        label="Giao thức"
        required
        rules={[{ required: true }]}
      >
        <Radio.Group>
          <Radio value="http">HTTP</Radio>
          <Radio value="https">HTTPS</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item<TAddRequestDto | TUpdateRequestDto>
        name="host"
        label="Host"
        required
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<TAddRequestDto | TUpdateRequestDto>
        name="port"
        label="Port"
        required
        rules={[{ required: true }]}
      >
        <InputNumber onKeyDown={inputIntKeyDown} />
      </Form.Item>

      <Form.Item<TAddRequestDto | TUpdateRequestDto>
        name="path"
        label="Path"
        required
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<TAddRequestDto | TUpdateRequestDto>
        name="method"
        label="Phương thức"
        required
        rules={[{ required: true }]}
      >
        <Select>
          <Select.Option value="GET">GET</Select.Option>
          <Select.Option value="POST">POST</Select.Option>
          <Select.Option value="PUT">PUT</Select.Option>
          <Select.Option value="DELETE">DELETE</Select.Option>
          <Select.Option value="PATCH">PATCH</Select.Option>
          <Select.Option value="OPTIONS">OPTIONS</Select.Option>
          <Select.Option value="HEAD">HEAD</Select.Option>
        </Select>
      </Form.Item>

      <Divider />

      <Form.Item label="Headers" wrapperCol={{ span: 24 }}>
        <Form.List name="headers">
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
                  {'Thêm header'}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Divider />

      <Form.Item label="Parameters" wrapperCol={{ span: 24 }}>
        <Form.List name="params">
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
                  {'Thêm parameter'}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Divider />

      <Form.Item<TAddRequestDto | TUpdateRequestDto> name="body" label="Body">
        <Input.TextArea />
      </Form.Item>
    </Form>
  );
};

export default RequestFormBase;
