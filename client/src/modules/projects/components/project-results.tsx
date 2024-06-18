import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button, Space, Table, Typography } from 'antd';
import dayjs from 'dayjs';

import useApp from '@/hooks/use-app';

import { TProject, TProjectStage, TRunResult } from '../project.model';
import projectService from '../project.service';

type TProjectResultsProps = {
  project: TProject;
  refetch: () => Promise<any>;
};

function ProjectResults({ project, refetch }: TProjectResultsProps) {
  const { antdApp } = useApp();

  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectService.deleteResult(project.id, id),
    onSuccess: async () => {
      await refetch();
      antdApp.message.success('Xóa kết quả thành công');
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  return (
    <>
      <Space align="baseline" size="large">
        <Typography.Title level={5}>Kết quả chạy</Typography.Title>
      </Space>

      <Table
        bordered
        dataSource={project?.runResults}
        rowKey={(record) => record.id}
        pagination={false}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 150,
            render: (id: string) => (
              <Typography.Link
                onClick={() =>
                  navigate({
                    to: '/app/projects/$projectId/results/$resultId',
                    params: { projectId: project.id, resultId: id },
                  })
                }
              >
                {id}
              </Typography.Link>
            ),
          },
          {
            title: 'Bắt đầu',
            key: 'startTimestamp',
            dataIndex: 'startTimestamp',
            render: (startTimestamp: number) =>
              dayjs(startTimestamp).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            title: 'Kết thúc',
            key: 'finishTimestamp',
            dataIndex: 'finishTimestamp',
            render: (finishTimestamp: number) =>
              dayjs(finishTimestamp).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            title: 'Kịch bản',
            key: 'stages',
            dataIndex: 'stages',
            render: (stages: TProjectStage[]) => (
              <Space direction="vertical" size="small">
                {stages.map((stage, index) => (
                  <Space key={index}>
                    <Typography.Text>{stage.vus} VU</Typography.Text>|
                    <Typography.Text>{stage.duration} giây</Typography.Text>
                  </Space>
                ))}
              </Space>
            ),
          },
          {
            title: 'Hành động',
            key: 'actions',
            width: 150,
            render: (record: TRunResult) => (
              <Space>
                <Link
                  to="/app/projects/$projectId/results/$resultId"
                  params={{ projectId: project.id, resultId: record.id }}
                >
                  <Button type="link" icon={<EyeOutlined />}>
                    {'Chi tiết'}
                  </Button>
                </Link>
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    antdApp.modal.confirm({
                      title: 'Xác nhận xóa',
                      content: 'Bạn có chắc muốn xóa kết quả này?',
                      cancelText: 'Hủy',
                      okText: 'Xóa',
                      onOk: () => deleteMutation.mutate(record.id),
                    });
                  }}
                >
                  Xóa
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </>
  );
}

export default ProjectResults;
