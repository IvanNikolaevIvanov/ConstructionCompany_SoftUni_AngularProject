using ConstructionCompany.Core.Contracts;
using ConstructionCompany.Core.Models;
using ConstructionCompany.Infrastructure.Data.Common;
using ConstructionCompany.Infrastructure.Enumerations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using MigraDoc.DocumentObjectModel;
using MigraDoc.Rendering;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using System;
using System.Globalization;
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

        // Agent
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
                    Id = entity.Id,
                    Title = entity.Title,
                    Description = entity.Description,
                    SubmittedAt = entity.SubmittedAt.ToShortDateString(),
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

                    AgentId = entity.AgentId,
                    SupervisorId = entity.SupervisorId,

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
                var appsInDb = await repository.AllReadOnly<ProjectApplication>()
                                                .Where(app => app.SupervisorId == supervisorId && ((int)app.Status) == statusId)
                                                .OrderByDescending(app => app.Id)
                                                .Take(10)
                                                .ToListAsync();
                var appsToReturn = new List<ProjectApplicationDetailsModel>();

                foreach (var app in appsInDb)
                {
                    var appToAdd = await this.GetApplicationByIdAsync(app.Id);
                    appsToReturn.Add(appToAdd);
                }


               
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

        public async Task<byte[]> PrintApplication(int appId)
        {
            try
            {
                var arrayToReturn = new byte[0];
                var appToPrint = await repository.GetByIdAsync<ProjectApplication>(appId);
                if (appToPrint == null)
                {
                    throw new InvalidOperationException($"Application with ID {appId} not found.");
                }

                var agent = await repository.GetByIdAsync<ApplicationUser>(appToPrint.AgentId);
                var supervisor = await repository.GetByIdAsync<ApplicationUser>(appToPrint.SupervisorId);

                arrayToReturn = GenerateDocument(appToPrint, $"{agent.FirstName} {agent.LastName}", $"{supervisor.FirstName} {supervisor.LastName}");

                //using var document = new PdfDocument();
                //var page = document.AddPage();
                //var gfx = XGraphics.FromPdfPage(page);
                //var font = new XFont("Verdana", 12);

                //double y = 50;
                //const double lineHeight = 40;

                //gfx.DrawString($"Application ID: {appToPrint.Id} Title: {appToPrint.Title}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //gfx.DrawString($"Agent: {agent.FirstName} {agent.LastName} Supervisor: {supervisor.FirstName} {supervisor.LastName}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //gfx.DrawString($"Submitted At: {appToPrint.SubmittedAt:yyyy-MM-dd}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //gfx.DrawString($"Status: {appToPrint.Status}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //gfx.DrawString($"Client Name: {appToPrint.ClientName}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //gfx.DrawString($"Client Bank: {appToPrint.ClientBank}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //gfx.DrawString($"Client IBAN: {appToPrint.ClientBankIban}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //gfx.DrawString($"Price: {appToPrint.Price:C2}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //gfx.DrawString($"Price (in words): {appToPrint.PriceInWords}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //gfx.DrawString($"Uses Concrete: {(appToPrint.UsesConcrete ? "Yes" : "No")}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //gfx.DrawString($"Uses Bricks: {(appToPrint.UsesBricks ? "Yes" : "No")}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //gfx.DrawString($"Uses Steel: {(appToPrint.UsesSteel ? "Yes" : "No")}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //gfx.DrawString($"Uses Insulation: {(appToPrint.UsesInsulation ? "Yes" : "No")}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //gfx.DrawString($"Uses Wood: {(appToPrint.UsesWood ? "Yes" : "No")}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //gfx.DrawString($"Uses Glass: {(appToPrint.UsesGlass ? "Yes" : "No")}", font, XBrushes.Black, new XPoint(40, y));
                //y += lineHeight;

                //using var stream = new MemoryStream();
                //document.Save(stream, false);
                //stream.Position = 0;

                //arrayToReturn = stream.ToArray();

                return arrayToReturn;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<int> ReturnApplication(int appId, string feedbackText)
        {
            try
            {
                var applicationToReturn = await repository.GetByIdAsync<ProjectApplication>(appId);
                var supervisor = await repository.GetByIdAsync<ApplicationUser>(applicationToReturn.SupervisorId);

                var feedbackToSave = new SupervisorFeedback()
                {
                    ApplicationId = appId,
                    AuthorId = supervisor.Id,
                    CreatedAt = DateTime.Now,
                    Text = feedbackText,
                };

                await repository.AddAsync<SupervisorFeedback>(feedbackToSave);

                applicationToReturn.Status = ApplicationStatus.ReturnedBySupervisor;
                await repository.SaveChangesAsync();

                return feedbackToSave.Id;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<int> ApproveApplication(int appId)
        {
            try
            {
                var applicationToApprove = await repository.GetByIdAsync<ProjectApplication>(appId);

                applicationToApprove.Status = ApplicationStatus.Approved;
                await repository.SaveChangesAsync();

                return applicationToApprove.Id;
            }
            catch (Exception)
            {

                throw;
            }
        }

        private byte[] GenerateDocument(ProjectApplication appToPrint, string agentName, string supervisorName)
        {
            var documentToRetun = new byte[0];

            // Initialize the document
            var document = new Document();
            document.Info.Title = "Application Details";
            document.Info.Subject = "Detailed information about the application";
            document.Info.Author = "Your Company";

            // Set the document culture to ensure proper formatting
            document.Culture = CultureInfo.InvariantCulture;

            // Define the default font style
            var style = document.Styles[StyleNames.Normal];
            style.Font.Name = "Verdana";
            style.Font.Size = Unit.FromPoint(12);

            // Add a section to the document
            var section = document.AddSection();

            // Add a heading
            var heading = section.AddParagraph("Application Details");
            heading.Format.Font.Size = Unit.FromPoint(16);
            heading.Format.Font.Bold = true;
            heading.Format.Alignment = ParagraphAlignment.Center;
            heading.Format.SpaceAfter = Unit.FromPoint(12);

            // Add application details
            AddDetailParagraph(section, "Application ID:", appToPrint.Id.ToString());
            AddDetailParagraph(section, "Title:", appToPrint.Title);
            AddDetailParagraph(section, "Agent:", $"{agentName}");
            AddDetailParagraph(section, "Supervisor:", $"{supervisorName}");
            AddDetailParagraph(section, "Submitted At:", appToPrint.SubmittedAt.ToString("yyyy-MM-dd"));
            AddDetailParagraph(section, "Status:", appToPrint.Status.ToString());
            AddDetailParagraph(section, "Client Name:", appToPrint.ClientName);
            AddDetailParagraph(section, "Client Bank:", appToPrint.ClientBank);
            AddDetailParagraph(section, "Client IBAN:", appToPrint.ClientBankIban);
            AddDetailParagraph(section, "Price:", appToPrint.Price.ToString("C2"));
            AddDetailParagraph(section, "Price (in words):", appToPrint.PriceInWords);
            AddDetailParagraph(section, "Uses Concrete:", appToPrint.UsesConcrete ? "Yes" : "No");
            AddDetailParagraph(section, "Uses Bricks:", appToPrint.UsesBricks ? "Yes" : "No");
            AddDetailParagraph(section, "Uses Steel:", appToPrint.UsesSteel ? "Yes" : "No");
            AddDetailParagraph(section, "Uses Insulation:", appToPrint.UsesInsulation ? "Yes" : "No");
            AddDetailParagraph(section, "Uses Wood:", appToPrint.UsesWood ? "Yes" : "No");
            AddDetailParagraph(section, "Uses Glass:", appToPrint.UsesGlass ? "Yes" : "No");

            // Render the document to a PDF
            var pdfRenderer = new PdfDocumentRenderer(true);
            pdfRenderer.Document = document;
            pdfRenderer.RenderDocument();

            // Save the document to a file
            using (var ms = new MemoryStream())
            {
                pdfRenderer.PdfDocument.Save(ms, false);
                return ms.ToArray();
            }
        }

        private void AddDetailParagraph(Section section, string label, string value)
        {
            var paragraph = section.AddParagraph();
            paragraph.AddFormattedText($"{label} ", TextFormat.Bold);

            // Add value with underline and grey highlight
            var formattedValue = paragraph.AddFormattedText(value);

            // Underline
            formattedValue.Underline = Underline.Single;

            paragraph.Format.SpaceAfter = Unit.FromPoint(6);
        }
    }
}
