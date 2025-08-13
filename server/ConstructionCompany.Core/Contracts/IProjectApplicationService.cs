using ConstructionCompany.Core.Models;

namespace ConstructionCompany.Core.Contracts
{
    public interface IProjectApplicationService
    {
        Task<ProjectApplication> CreateApplicationAsync(string agentId, ProjectApplicationModel model);

        Task<List<ProjectApplicationDetailsModel>> GetApplicationsByByStatusAndAgentIdAsync(int statusId, string agentId);

        //Task<List<ProjectApplicationDetailsModel>> GetCreatedApplicationsByAgentIdAsync(string agentId);

        //Task<List<ProjectApplicationDetailsModel>> GetSubmittedApplicationsByAgentIdAsync(string agentId);

        Task<ProjectApplicationDetailsModel> GetApplicationByIdAsync(int id);

        Task<int> UpdateApplicationAsync(ProjectApplicationDetailsModel model, int id);

        Task SaveApplicationFilesAsync(int appId, List<ApplicationFileModel> files);

        Task<List<ApplicationFileModel>> GetFilesByApplicationId(int appId);

        Task RemoveApplicationFilesAsync(List<ApplicationFileModel> oldFiles);

        Task<bool> DeleteApplicationAsync(int id);

        Task<bool> ApplicationExist(int id);

        Task<List<ApplicationUserModel>> GetSupervisorsAsync();

        Task<bool> SubmitApplicationAsync(int appId, string supervisorId);

        Task<bool> SupervisorExists(string supervisorId);

        Task<List<SupervisorFeedbackDto>> GetApplicationFeedbacks(int applicationId);

        //Supervisor

        Task<List<ProjectApplicationDetailsModel>> GetSupervisorApplicationsByStatus(int statusId, string supervisorId);

        Task<byte[]> PrintApplication(int appId);

        Task<int> ReturnApplication(int appId, string feedbackText)
    }
}
