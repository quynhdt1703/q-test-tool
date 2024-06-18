import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Flex, Space, Table, Typography } from 'antd';
import { useCallback, useState } from 'react';

import useApp from '@/hooks/use-app';
import AddRequestDrawer from '@/modules/projects/components/add-request-drawer';
import UpdateRequestDrawer from '@/modules/projects/components/update-request-drawer';

import { TProject, TRequest } from '../project.model';
import projectService from '../project.service';
import RequestMethodTag from './request-method-tag';

type TProjectRequestsProps = {
  project: TProject;
  refetch: () => Promise<any>;
};

function ProjectRequests({ project, refetch }: TProjectRequestsProps) {
  const { antdApp } = useApp();

  const [openAddRequestDrawer, setOpenAddRequestDrawer] = useState(false);
  const [openCloneRequestDrawer, setOpenCloneRequestDrawer] = useState(false);
  const [openUpdateRequestForm, setOpenUpdateRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TRequest>();

  const setRequestById = useCallback(
    (id: string) => {
      setSelectedRequest(project.requests.find((r) => r.id === id));
    },
    [project.requests],
  );

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectService.deleteRequest(project.id, id),
    onSuccess: async () => {
      await refetch();
      antdApp.message.success('Xóa request thành công');
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  return (
    <>
      <AddRequestDrawer
        projectId={project.id}
        open={openAddRequestDrawer}
        setOpen={setOpenAddRequestDrawer}
        refetch={refetch}
      />

      {selectedRequest && (
        <AddRequestDrawer
          open={openCloneRequestDrawer}
          setOpen={setOpenCloneRequestDrawer}
          refetch={refetch}
          projectId={project.id}
          initialValues={selectedRequest}
        />
      )}

      {selectedRequest && (
        <UpdateRequestDrawer
          open={openUpdateRequestForm}
          setOpen={setOpenUpdateRequestForm}
          refetch={refetch}
          projectId={project.id}
          request={selectedRequest}
        />
      )}

      <Space align="baseline" size="large">
        <Typography.Title level={5}>{'Danh sách Requests'}</Typography.Title>
        <Button
          size="small"
          icon={<PlusOutlined />}
          type="dashed"
          onClick={() => {
            setOpenAddRequestDrawer(true);
          }}
        >
          {'Thêm'}
        </Button>
      </Space>

      <Table
        bordered
        rowKey={(record) => record.id}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 150,
          },
          {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
              <Typography.Text strong>{text}</Typography.Text>
            ),
          },
          {
            title: 'Phương thức',
            dataIndex: 'method',
            key: 'method',
            render: (text) => <RequestMethodTag method={text} />,
          },
          {
            title: 'URL',
            key: 'url',
            render: (_, record) => (
              <Typography.Link>{`${record.protocol}://${record.host}:${record.port}${record.path}`}</Typography.Link>
            ),
          },
          {
            title: 'Hành động',
            key: 'actions',
            width: 150,
            render: (_, record) => (
              <Flex>
                <Button
                  icon={<CopyOutlined />}
                  type="link"
                  onClick={() => {
                    setRequestById(record.id);
                    setOpenCloneRequestDrawer(true);
                  }}
                >
                  {'Nhân bản'}
                </Button>
                <Button
                  icon={<EditOutlined />}
                  type="link"
                  onClick={() => {
                    setRequestById(record.id);
                    setOpenUpdateRequestForm(true);
                  }}
                >
                  {'Sửa'}
                </Button>
                <Button
                  danger
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    antdApp.modal.confirm({
                      title: 'Xác nhận xóa',
                      content: 'Bạn có chắc muốn xóa request này?',
                      cancelText: 'Hủy',
                      okText: 'Xóa',
                      onOk: () => {
                        deleteMutation.mutate(record.id);
                      },
                    });
                  }}
                >
                  {'Xóa'}
                </Button>
              </Flex>
            ),
          },
        ]}
        dataSource={project.requests}
        pagination={false}
      />
    </>
  );
}

export default ProjectRequests;
