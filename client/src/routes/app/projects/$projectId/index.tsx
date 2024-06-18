import { EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  Divider,
  Flex,
  Modal,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import React from 'react';
import useWebSocket from 'react-use-websocket';

import useApp from '@/hooks/use-app';
import ProjectRequests from '@/modules/projects/components/project-requests';
import ProjectResults from '@/modules/projects/components/project-results';
import UpdateProjectDrawer from '@/modules/projects/components/update-project-drawer';
import useGetProject from '@/modules/projects/hooks/use-get-project';
import SpinTimer from '@/shared/components/spin-timer';

export const Route = createFileRoute('/app/projects/$projectId/')({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { projectId: id } = Route.useParams();
  const navigate = Route.useNavigate();

  const { token } = useApp();

  const projectQuery = useGetProject(id);
  const { data: project, isLoading } = projectQuery;

  const [socketUrl] = useState('ws://localhost:8080/api/ws');
  const [openRunModal, setOpenRunModal] = useState(false);
  const [openUpdateDrawer, setOpenUpdateDrawer] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const { sendMessage: wsSend, lastMessage: wsLastMsg } =
    useWebSocket(socketUrl);

  useEffect(() => {
    if (wsLastMsg !== null) {
      const data = JSON.parse(wsLastMsg.data);

      if (data.topic === 'done') {
        setOpenRunModal(false);
        setRemainingTime(0);

        console.log(wsLastMsg);

        navigate({
          to: '/app/projects/$projectId/results/$resultId',
          params: data.payload,
        });
      }
    }
  }, [navigate, wsLastMsg]);

  return (
    <>
      <Modal
        title="Chạy dự án"
        open={openRunModal}
        okButtonProps={{ hidden: true }}
        cancelText="Hủy"
        onCancel={() => {
          setOpenRunModal(false);
          setRemainingTime(0);
        }}
      >
        <SpinTimer
          time={remainingTime}
          onTimeout={() => {
            setOpenRunModal(false);
            setRemainingTime(0);
          }}
        />
      </Modal>

      {project && (
        <UpdateProjectDrawer
          id={project?.id}
          open={openUpdateDrawer}
          setOpen={setOpenUpdateDrawer}
        />
      )}

      <Flex vertical>
        {isLoading && !project ? (
          <Skeleton active />
        ) : (
          <>
            <Flex align="baseline" justify="space-between">
              <Space direction="vertical">
                <Typography.Title level={4}>{project?.name}</Typography.Title>
                <Typography.Text type="secondary">
                  {project?.description}
                </Typography.Text>

                <Flex>
                  {project?.stages.map((stage, index) => (
                    <React.Fragment key={index}>
                      <span
                        css={css`
                          color: ${token.colorPrimary};
                          font-weight: bold;
                        `}
                      >
                        {stage.vus}
                      </span>
                      <span
                        css={css`
                          color: ${token.colorTextSecondary};
                        `}
                      >
                        {'VU'}
                      </span>
                      |
                      <span
                        css={css`
                          color: ${token.orange};
                          font-weight: bold;
                        `}
                      >
                        {stage.duration}
                      </span>
                      <span
                        css={css`
                          color: ${token.colorTextSecondary};
                        `}
                      >
                        s
                      </span>
                      {index < project.stages.length - 1 && (
                        <span
                          css={css`
                            margin-left: 8px;
                            margin-right: 8px;
                          `}
                        >
                          {'→'}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </Flex>
              </Space>

              <Space>
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setOpenUpdateDrawer(true);
                  }}
                >
                  {'Chỉnh sửa'}
                </Button>
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() => {
                    wsSend(
                      JSON.stringify({
                        event: 'run',
                        payload: {
                          projectId: id,
                        },
                      }),
                    );
                    setOpenRunModal(true);
                    setRemainingTime(
                      project?.stages.reduce((acc, cur) => {
                        return acc + cur.duration;
                      }, 0) || 0,
                    );
                  }}
                >
                  {'Chạy'}
                </Button>
              </Space>
            </Flex>

            <Divider />

            {project?.id ? (
              <ProjectRequests
                project={project}
                refetch={() => projectQuery.refetch()}
              />
            ) : (
              <Skeleton active />
            )}

            <Divider />

            {project?.id ? (
              <ProjectResults
                project={project}
                refetch={() => projectQuery.refetch()}
              />
            ) : (
              <Skeleton active />
            )}
          </>
        )}
      </Flex>
    </>
  );
}
