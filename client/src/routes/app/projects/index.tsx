import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Button, Flex, Skeleton, Space, Table, Typography } from 'antd';
import { useCallback, useState } from 'react';

import useApp from '@/hooks/use-app';
import CreateProjectDrawer from '@/modules/projects/components/create-project-drawer';
import UpdateProjectDrawer from '@/modules/projects/components/update-project-drawer';
import useGetListProject from '@/modules/projects/hooks/use-get-list-project';
import { TProject } from '@/modules/projects/project.model';
import projectService from '@/modules/projects/project.service';

export const Route = createFileRoute('/app/projects/')({
  component: ProjectsPage,
});

function ProjectsPage() {
  const { token, antdApp } = useApp();

  const [openCreateDrawer, setOpenCreateDrawer] = useState(false);
  const [updateProjectDrawer, setUpdateProjectDrawer] = useState(false);
  const [selectedProject, setSelectedProject] = useState<TProject>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const projectsQuery = useGetListProject();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: async () => {
      await projectsQuery.refetch();
      antdApp.message.success('Xóa thành công');
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: (ids: string[]) => projectService.deleteMany(ids),
    onSuccess: async () => {
      await projectsQuery.refetch();
      antdApp.message.success('Xóa thành công');
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  const onClickUpdate = useCallback((project: TProject) => {
    setSelectedProject(project);
    setUpdateProjectDrawer(true);
  }, []);

  const onClickManyDelete = useCallback(() => {
    antdApp.modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa các project đã chọn?',
      cancelText: 'Hủy',
      okText: 'Xóa',
      onOk: () => deleteManyMutation.mutate(selectedIds),
    });
  }, [antdApp.modal, deleteManyMutation, selectedIds]);

  const onClickDelete = useCallback(
    (id: string) => {
      antdApp.modal.confirm({
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc chắn muốn xóa project này?',
        cancelText: 'Hủy',
        okText: 'Xóa',
        onOk: () => deleteMutation.mutate(id),
      });
    },
    [antdApp.modal, deleteMutation],
  );

  return (
    <>
      <CreateProjectDrawer
        open={openCreateDrawer}
        setOpen={setOpenCreateDrawer}
        refetch={() => projectsQuery.refetch()}
      />

      {selectedProject?.id && (
        <UpdateProjectDrawer
          id={selectedProject?.id}
          open={updateProjectDrawer}
          setOpen={setUpdateProjectDrawer}
          refetchList={() => projectsQuery.refetch()}
        />
      )}

      <Flex vertical gap={token.size}>
        <Flex align="center">
          <Typography.Title level={4}>{'Danh sách Dự án'}</Typography.Title>

          <Space
            css={css`
              margin-left: auto;
            `}
          >
            <Button
              css={css`
                margin-left: auto;
                display: ${selectedIds.length ? 'block' : 'none'};
              `}
              danger
              type="dashed"
              icon={<DeleteOutlined />}
              onClick={onClickManyDelete}
            >
              {'Xóa mục đã chọn'}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenCreateDrawer(true)}
            >
              {'Thêm mới'}
            </Button>
          </Space>
        </Flex>

        {projectsQuery.isLoading && !projectsQuery.data ? (
          <Skeleton active />
        ) : (
          <Table
            rowKey="id"
            dataSource={projectsQuery.data}
            rowHoverable
            bordered
            footer={(currentPageData) =>
              `Tổng: ${currentPageData.length} dự án`
            }
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys) =>
                setSelectedIds(selectedRowKeys.map(String)),
            }}
            columns={[
              {
                title: 'ID',
                dataIndex: 'id',
                width: 350,
              },
              {
                title: 'Tên dự án',
                render: (record: TProject) => (
                  <Link
                    to={'/app/projects/$projectId'}
                    params={{ projectId: record.id }}
                  >
                    <Typography.Text
                      strong
                      css={css`
                        color: ${token.colorLink};
                        transition: ${token.motionEaseInBack};
                        :hover {
                          color: ${token.colorLinkHover};
                        }
                      `}
                    >
                      {record.name}
                    </Typography.Text>
                  </Link>
                ),
              },
              {
                title: 'Hành động',
                width: 200,
                render: (record: TProject) => (
                  <Space>
                    <Button
                      type="link"
                      onClick={() => onClickUpdate(record)}
                      icon={<EditOutlined />}
                    >
                      {'Chỉnh sửa'}
                    </Button>
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => onClickDelete(record.id)}
                    >
                      {'Xóa'}
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        )}
      </Flex>
    </>
  );
}
