using ConstructionCompany.Core.Contracts;
using ConstructionCompany.Core.Models;
using ConstructionCompany.Infrastructure.Data.Common;
using ConstructionCompany.Infrastructure.Enumerations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Channels;
using static System.Net.Mime.MediaTypeNames;

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

                if (entity == null)
                {
                    throw new Exception("Application not found.");
                }

                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", entity.Id.ToString());

                var entityFiles = await repository.GetFilesByApplicationId(id);

                var filesToReturn = new List<FileModelDto>();

                foreach (var file in entityFiles) 
                {
                    var fullPath = Path.Combine(uploadFolder, Path.GetFileName(file.FilePath));

                    if (System.IO.File.Exists(fullPath))
                    {
                        var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
                        var base64Content = Convert.ToBase64String(fileBytes);

                        filesToReturn.Add(new FileModelDto
                        {
                            FileName = file.FileName,
                            Base64Content = base64Content
                        });
                    }
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

                    Files = filesToReturn,
                };


                return appToReturn;
            }
            catch (Exception)
            {

                throw;
            }
        }

        //public async Task<List<ProjectApplicationDetailsModel>> GetCreatedApplicationsByAgentIdAsync(string agentId)
        //{

        //    try
        //    {
        //        var appsToReturn = await repository.AllReadOnly<ProjectApplication>()
        //                                        .Where(app => app.AgentId == agentId && app.Status == 0)
        //                                        .OrderByDescending(app => app.Id)
        //                                        .Select(app => new ProjectApplicationDetailsModel()
        //                                        {
        //                                            Id = app.Id,
        //                                            Title = app.Title,
        //                                            Description = app.Description,
        //                                            ClientName = app.ClientName,
        //                                            ClientBank = app.ClientBank,
        //                                            ClientBankIban = app.ClientBankIban,
        //                                            Price = app.Price,
        //                                            PriceInWords = app.PriceInWords,
        //                                            SupervisorId = app.SupervisorId,
        //                                            SupervisorName = app.Supervisor != null && !string.IsNullOrEmpty(app.Supervisor.UserName) ? app.Supervisor.UserName : string.Empty,
        //                                            UsesBricks = app.UsesBricks,
        //                                            UsesConcrete = app.UsesConcrete,
        //                                            UsesGlass = app.UsesGlass,
        //                                            UsesInsulation = app.UsesInsulation,
        //                                            UsesSteel = app.UsesSteel,
        //                                            UsesWood = app.UsesWood,
        //                                        })
        //                                        .Take(10)
        //                                        .ToListAsync();

        //        return appsToReturn;
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
           
        //}

        public async Task<List<ProjectApplicationDetailsModel>> GetApplicationsByByStatusAndAgentIdAsync(int statusId, string agentId)
        {

            try
            {
                var appsToReturn = await repository.AllReadOnly<ProjectApplication>()
                                                .Where(app => app.AgentId == agentId && ((int)app.Status) == statusId)
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
                                                    SubmittedAt = app.SubmittedAt.ToString(),
                                                    //SupervisorName = app.Supervisor != null && !string.IsNullOrEmpty(app.Supervisor.UserName) ? app.Supervisor.UserName : string.Empty,
                                                    UsesBricks = app.UsesBricks,
                                                    UsesConcrete = app.UsesConcrete,
                                                    UsesGlass = app.UsesGlass,
                                                    UsesInsulation = app.UsesInsulation,
                                                    UsesSteel = app.UsesSteel,
                                                    UsesWood = app.UsesWood,
                                                })
                                                .Take(10)
                                                .ToListAsync();

                if (statusId > 0)
                {
                    //Get Supervisors for each app
                    foreach (var app in appsToReturn)
                    {
                        var supervisor = new ApplicationUser();
                        if (app.SupervisorId != null)
                        {
                            supervisor = await repository.GetByIdAsync<ApplicationUser>(app.SupervisorId);
                        }

                        if (supervisor != null && !string.IsNullOrEmpty(supervisor.Id))
                        {
                            app.SupervisorName = $"{supervisor.FirstName} {supervisor.LastName}";
                        }
                    }
                }

                return appsToReturn;
            }
            catch (Exception)
            {
                throw;
            }

        }
        

        //public async Task<List<ProjectApplicationDetailsModel>> GetSubmittedApplicationsByAgentIdAsync(string agentId)
        //{
        //    try
        //    {
        //        var appsToReturn = await repository.AllReadOnly<ProjectApplication>()
        //                                        .Where(app => app.AgentId == agentId && app.Status == ApplicationStatus.Submitted)
        //                                        .OrderByDescending(app => app.Id)
        //                                        .Select(app => new ProjectApplicationDetailsModel()
        //                                        { 
        //                                            Id = app.Id,
        //                                            Title = app.Title,
        //                                            Description = app.Description,
        //                                            ClientName = app.ClientName,
        //                                            ClientBank = app.ClientBank,
        //                                            ClientBankIban = app.ClientBankIban,
        //                                            Price = app.Price,
        //                                            PriceInWords = app.PriceInWords,
        //                                            SupervisorId = app.SupervisorId,
        //                                            SubmittedAt = app.SubmittedAt.ToString(),
        //                                            //SupervisorName = app.Supervisor != null && !string.IsNullOrEmpty(app.Supervisor.UserName) ? app.Supervisor.UserName : string.Empty,
        //                                            UsesBricks = app.UsesBricks,
        //                                            UsesConcrete = app.UsesConcrete,
        //                                            UsesGlass = app.UsesGlass,
        //                                            UsesInsulation = app.UsesInsulation,
        //                                            UsesSteel = app.UsesSteel,
        //                                            UsesWood = app.UsesWood,
        //                                        })
        //                                        .Take(10)
        //                                        .ToListAsync();

        //        //Get Supervisors for each app
        //        foreach (var app in appsToReturn)
        //        {
        //            var supervisor = new ApplicationUser();
        //            if (app.SupervisorId != null)
        //            {
        //                supervisor = await repository.GetByIdAsync<ApplicationUser>(app.SupervisorId);
        //            }
                   
        //            if (supervisor != null)
        //            {
        //                app.SupervisorName = $"{supervisor.FirstName} {supervisor.LastName}";
        //            }
        //        }

        //        return appsToReturn;
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}

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

                    filesToReturn.Add(fileToSave);
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

        public async Task<bool> DeleteApplicationAsync(int id)
        {
            try
            {
                var application = await repository.GetByIdAsync<ProjectApplication>(id);
                if (application == null)
                {
                    return false;
                }

                await repository.DeleteAsync<ProjectApplication>(application);
                var changes = await repository.SaveChangesAsync();

                return changes > 0;
            }
            catch (Exception)
            {

                throw;
            }
            
        }

        public async Task<bool> ApplicationExist(int id)
        {
            try
            {
                var application = await repository.GetByIdAsync<ProjectApplication>(id);
                if (application == null)
                {
                    return false;
                }

                return true;
            }
            catch (Exception)
            {

                throw;
            }
           
        }

        public async Task<List<ApplicationUserModel>> GetSupervisorsAsync()
        {
            try
            {
                var supervisors = await repository.GetSupervisorsAsync();

                var supervisorsToReturn = new List<ApplicationUserModel>();
                foreach (var supervisor in supervisors)
                {
                    var model = new ApplicationUserModel()
                    {
                        Id = supervisor.Id,
                        FirstName = supervisor.FirstName,
                        LastName = supervisor.LastName,
                        Email = supervisor.Email,
                    };

                    supervisorsToReturn.Add(model);
                }

                return supervisorsToReturn;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<bool> SubmitApplicationAsync(int appId, string supervisorId)
        {
            try
            {
                var applicationToSubmit = await repository.GetByIdAsync<ProjectApplication>(appId);
                if (applicationToSubmit != null)
                {
                    applicationToSubmit.Status = ApplicationStatus.Submitted;
                    applicationToSubmit.SupervisorId = supervisorId;
                    applicationToSubmit.SubmittedAt = DateTime.Now;
                    await repository.SaveChangesAsync();
                    return true;
                }

                return false;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> SupervisorExists(string supervisorId)
        {
            var supervisor = await repository.GetByIdAsync<ApplicationUser>(supervisorId);
            return supervisor != null;
        }
        public async Task<List<SupervisorFeedbackDto>> GetApplicationFeedbacks(int applicationId)
        {

            try
            {
                var feedbacksToReturn = await repository.AllReadOnly<SupervisorFeedback>()
                                                .Where(fb => fb.ApplicationId == applicationId)
                                                .OrderBy(fb => fb.Id)
                                                .Select(fb => new SupervisorFeedbackDto()
                                                {
                                                    Id = fb.Id,
                                                    Text = fb.Text,
                                                    CreatedAt = fb.CreatedAt.ToShortDateString(),
                                                    ApplicationId = fb.ApplicationId,
                                                    AuthorId = fb.AuthorId,
                                                })
                                                .ToListAsync();

                
                    foreach (var fb in feedbacksToReturn)
                    {
                        var supervisor = new ApplicationUser();
                        if (fb.AuthorId != null)
                        {
                            supervisor = await repository.GetByIdAsync<ApplicationUser>(fb.AuthorId);
                        }

                        if (supervisor != null)
                        {
                            fb.AuthorName = $"{supervisor.FirstName} {supervisor.LastName}";
                        }
                    }
                

                return feedbacksToReturn;
            }
            catch (Exception)
            {
                throw;
            }

        }

        // Supervisor
            public async Task<List<ProjectApplicationDetailsModel>> GetSupervisorApplicationsByStatus(int statusId, string supervisorId) 
        { 

            try
            {
                var appsToReturn = await repository.AllReadOnly<ProjectApplication>()
                                                .Where(app => app.SupervisorId == supervisorId && ((int)app.Status) == statusId)
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
                                                    AgentId = app.AgentId,
                                                    SupervisorId = app.SupervisorId,
                                                    SubmittedAt = app.SubmittedAt.ToString(),
                                                    UsesBricks = app.UsesBricks,
                                                    UsesConcrete = app.UsesConcrete,
                                                    UsesGlass = app.UsesGlass,
                                                    UsesInsulation = app.UsesInsulation,
                                                    UsesSteel = app.UsesSteel,
                                                    UsesWood = app.UsesWood,
                                                })
                                                .Take(10)
                                                .ToListAsync();

               
                    //Get Agents for each app
                    foreach (var app in appsToReturn)
                    {
                        var agent = new ApplicationUser();
                        if (app.AgentId != null)
                        {
                            agent = await repository.GetByIdAsync<ApplicationUser>(app.AgentId);
                        }

                        if (agent != null && !string.IsNullOrEmpty(agent.Id))
                        {
                            app.AgentName = $"{agent.FirstName} {agent.LastName}";
                        }
                    }
                

                return appsToReturn;
            }
            catch (Exception)
            {
                throw;
            }

        }
    }
}
