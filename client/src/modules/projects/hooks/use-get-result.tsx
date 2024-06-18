import { useQuery } from '@tanstack/react-query';

import projectService from '../project.service';

const useGetResult = (
  projectId: string,
  resultId: string,
  withData = false,
) => {
  const projectQuery = useQuery({
    queryKey: ['/projects/results', projectId, resultId, withData],
    queryFn: () => projectService.getResult(projectId, resultId, withData),
  });

  return projectQuery;
};

export default useGetResult;
