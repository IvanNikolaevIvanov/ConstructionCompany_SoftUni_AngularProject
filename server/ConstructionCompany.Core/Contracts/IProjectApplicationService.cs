using ConstructionCompany.Core.Models;

namespace ConstructionCompany.Core.Contracts
{
    public interface IProjectApplicationService
    {
      Task<ProjectApplication> CreateApplicationAsync(string agentId, ProjectApplicationModel model);
    }
}
