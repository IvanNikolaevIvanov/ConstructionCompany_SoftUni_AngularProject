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
    }
}
