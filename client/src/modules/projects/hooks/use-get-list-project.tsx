import { useQuery } from '@tanstack/react-query';

import projectService from '../project.service';

const useGetListProject = () => {
  const projectsQuery = useQuery({
    queryKey: ['/projects'],
    queryFn: () => projectService.getList(),
  });

  return projectsQuery;
};

export default useGetListProject;
