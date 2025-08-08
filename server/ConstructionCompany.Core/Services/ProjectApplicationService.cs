using ConstructionCompany.Core.Contracts;
using ConstructionCompany.Core.Models;
using ConstructionCompany.Infrastructure.Data.Common;
using ConstructionCompany.Infrastructure.Enumerations;
using Microsoft.EntityFrameworkCore;
using System;

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

        public async Task<ProjectApplicationDetailsModel> GetApplicationByIdAsync(int id)
        {
            try
            {
                var entity = await repository.GetByIdAsync<ProjectApplication>(id);

                var entityFiles = await repository.GetFilesByApplicationId(id);

                if (entity == null)
                {
                    throw new Exception("Application not found.");
                }

                var appToReturn = new ProjectApplicationDetailsModel()
                {
                    Title = entity.Title,
                    Description = entity.Description,

                    ClientName = entity.ClientName,
                    ClientBank = entity.ClientBank,
                    ClientBankIban = entity.ClientBankIban,

                    Price = entity.Price,
                    PriceInWords = entity.PriceInWords,

                    UsesConcrete = entity.UsesConcrete,
                    UsesBricks = entity.UsesBricks,
                    UsesSteel = entity.UsesSteel,
                    UsesInsulation = entity.UsesInsulation,
                    UsesWood = entity.UsesWood,
                    UsesGlass = entity.UsesGlass,

                    Files = entityFiles?.Select(file => new ApplicationFileModel
                    {
                        FileName = file.FileName,
                        FilePath = file.FilePath,
                        UploadedAt = file.UploadedAt,
                    }).ToList() ?? new List<ApplicationFileModel>()
                };


                return appToReturn;
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
                                                    Id = app.Id,
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
                                                    Id = app.Id,
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

        public async Task<int> UpdateApplicationAsync(ProjectApplicationDetailsModel model, int id)
        {
            try
            {
                var applicationToUpdate = await repository.GetByIdAsync<ProjectApplication>(id);

                if (applicationToUpdate != null)
                {
                    applicationToUpdate.ClientBank = model.ClientBank;
                    applicationToUpdate.ClientBankIban = model.ClientBankIban;
                    applicationToUpdate.Price = model.Price;
                    applicationToUpdate.PriceInWords = model.PriceInWords;
                    applicationToUpdate.ClientName = model.ClientName;
                    applicationToUpdate.Description = model.Description;
                    applicationToUpdate.Title = model.Title;
                    applicationToUpdate.UsesBricks = model.UsesBricks;
                    applicationToUpdate.UsesGlass = model.UsesGlass;
                    applicationToUpdate.UsesInsulation = model.UsesInsulation;
                    applicationToUpdate.UsesWood = model.UsesWood;
                    applicationToUpdate.UsesConcrete = model.UsesConcrete;

                    //TODO Update Files Also
                    //if (model.Files != null)
                    //{
                    //    applicationToUpdate.Files.Clear();
                    //    foreach (var file in model.Files)
                    //    {
                    //        applicationToUpdate.Files.Add(file);
                    //    }
                    //}

                    await repository.SaveChangesAsync();

                    return applicationToUpdate.Id;
                }
                else
                {
                    return 0;
                }


            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task SaveApplicationFilesAsync(int appId, List<ApplicationFileModel> files)
        {
            try
            {
                foreach (var file in files)
                {
                    var fileToSave = new ApplicationFile()
                    {
                        ApplicationId = appId,
                        FileName = file.FileName,
                        FilePath = file.FilePath,
                        UploadedAt = file.UploadedAt,
                    };

                    await repository.AddAsync<ApplicationFile>(fileToSave);
                }

                await repository.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<List<ApplicationFileModel>> GetFilesByApplicationId(int appId)
        {
            try
            {
                var filesInDB = await repository.GetFilesByApplicationId(appId);

                var filesToReturn = new List<ApplicationFileModel>();

                foreach (var file in filesInDB)
                {
                    var fileToSave = new ApplicationFileModel()
                    {
                        Id = file.Id,
                        FileName = file.FileName,
                        FilePath = file.FilePath,
                        UploadedAt = file.UploadedAt,
                    };
                }

                return filesToReturn;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task RemoveApplicationFilesAsync(List<ApplicationFileModel> oldFiles)
        {
            try
            {
                foreach (var file in oldFiles)
                {
                    await repository.DeleteAsync<ApplicationFile>(file.Id);
                }
                await repository.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
