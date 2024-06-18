import { useQuery } from '@tanstack/react-query';

import projectService from '../project.service';

const useGetProject = (id: string) => {
  const projectQuery = useQuery({
    queryKey: ['/projects', id],
    queryFn: () => projectService.get(id),
  });

  return projectQuery;
};

export default useGetProject;
