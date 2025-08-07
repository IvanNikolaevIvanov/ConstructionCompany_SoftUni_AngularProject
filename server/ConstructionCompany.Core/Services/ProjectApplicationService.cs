using ConstructionCompany.Core.Contracts;
using ConstructionCompany.Core.Models;
using ConstructionCompany.Infrastructure.Data.Common;
using ConstructionCompany.Infrastructure.Enumerations;
using Microsoft.EntityFrameworkCore;

namespace ConstructionCompany.Core.Services
{
    public class ProjectApplicationService : IProjectApplicationService
    {
        private readonly IRepository repository;

        public ProjectApplicationService(IRepository _repository)
        {
            this.repository = _repository;
        }

        public async Task<ProjectApplication> CreateApplicationAsync(
        string agentId,
        ProjectApplicationModel model)
        {
            try
            {
                var application = new ProjectApplication
                {
                    Title = model.Title,
                    Description = model.Description,
                    ClientName = model.ClientName,
                    ClientBank = model.ClientBank,
                    ClientBankIban = model.ClientBankIban,
                    Price = model.Price,
                    PriceInWords = model.PriceInWords,
                    UsesConcrete = model.UsesConcrete,
                    UsesBricks = model.UsesBricks,
                    UsesSteel = model.UsesSteel,
                    UsesInsulation = model.UsesInsulation,
                    UsesWood = model.UsesWood,
                    UsesGlass = model.UsesGlass,
                    SubmittedAt = DateTime.UtcNow,
                    Status = ApplicationStatus.Created,
                    AgentId = agentId
                };

                await repository.AddAsync(application);
                await repository.SaveChangesAsync();

                return application;
            }
            catch (Exception)
            {

                throw;
            }
           
        }

        public async Task<List<ProjectApplicationDetailsModel>> GetCreatedApplicationsByAgentIdAsync(string agentId)
        {

            try
            {
                var appsToReturn = await repository.AllReadOnly<ProjectApplication>()
                                                .Where(app => app.AgentId == agentId && app.Status == 0)
                                                .OrderByDescending(app => app.Id)
                                                .Select(app => new ProjectApplicationDetailsModel()
                                                {
                                                    Title = app.Title,
                                                    Description = app.Description,
                                                    ClientName = app.ClientName,
                                                    ClientBank = app.ClientBank,
                                                    ClientBankIban = app.ClientBankIban,
                                                    Price = app.Price,
                                                    PriceInWords = app.PriceInWords,
                                                    SupervisorId = app.SupervisorId,
                                                    SupervisorName = app.Supervisor != null && !string.IsNullOrEmpty(app.Supervisor.UserName) ? app.Supervisor.UserName : string.Empty,
                                                    UsesBricks = app.UsesBricks,
                                                    UsesConcrete = app.UsesConcrete,
                                                    UsesGlass = app.UsesGlass,
                                                    UsesInsulation = app.UsesInsulation,
                                                    UsesSteel = app.UsesSteel,
                                                    UsesWood = app.UsesWood,
                                                })
                                                .Take(10)
                                                .ToListAsync();

                return appsToReturn;
            }
            catch (Exception)
            {
                throw;
            }
           
        }

        public async Task<List<ProjectApplicationDetailsModel>> GetSubmittedApplicationsByAgentIdAsync(string agentId)
        {
            try
            {
                var appsToReturn = await repository.AllReadOnly<ProjectApplication>()
                                                .Where(app => app.AgentId == agentId && app.Status == ApplicationStatus.Submitted)
                                                .OrderByDescending(app => app.Id)
                                                .Select(app => new ProjectApplicationDetailsModel()
                                                {
                                                    Title = app.Title,
                                                    Description = app.Description,
                                                    ClientName = app.ClientName,
                                                    ClientBank = app.ClientBank,
                                                    ClientBankIban = app.ClientBankIban,
                                                    Price = app.Price,
                                                    PriceInWords = app.PriceInWords,
                                                    SupervisorId = app.SupervisorId,
                                                    SupervisorName = app.Supervisor != null && !string.IsNullOrEmpty(app.Supervisor.UserName) ? app.Supervisor.UserName : string.Empty,
                                                    UsesBricks = app.UsesBricks,
                                                    UsesConcrete = app.UsesConcrete,
                                                    UsesGlass = app.UsesGlass,
                                                    UsesInsulation = app.UsesInsulation,
                                                    UsesSteel = app.UsesSteel,
                                                    UsesWood = app.UsesWood,
                                                })
                                                .Take(10)
                                                .ToListAsync();

                return appsToReturn;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
