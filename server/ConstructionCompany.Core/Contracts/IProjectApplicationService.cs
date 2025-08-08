using ConstructionCompany.Core.Models;

namespace ConstructionCompany.Core.Contracts
{
    public interface IProjectApplicationService
    {
      Task<ProjectApplication> CreateApplicationAsync(string agentId, ProjectApplicationModel model);

      Task<List<ProjectApplicationDetailsModel>> GetCreatedApplicationsByAgentIdAsync(string agentId);

      Task<List<ProjectApplicationDetailsModel>> GetSubmittedApplicationsByAgentIdAsync(string agentId);

      Task<ProjectApplicationDetailsModel> GetApplicationByIdAsync(int id);

      Task<int> UpdateApplicationAsync(ProjectApplicationDetailsModel model, int id);
    }
}
