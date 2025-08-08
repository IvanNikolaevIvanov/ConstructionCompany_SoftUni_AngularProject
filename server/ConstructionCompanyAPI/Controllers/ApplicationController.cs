using ConstructionCompany.Core.Contracts;
using ConstructionCompany.Core.Models;
using ConstructionCompany.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ConstructionCompany.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Agent,Supervisor")]
    public class ApplicationController : ControllerBase
    {
        private readonly IProjectApplicationService appService;

        public ApplicationController(IProjectApplicationService _appService)
        {
            appService = _appService;
        }

        //Agent

        [HttpGet("GetCreatedApplications")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> GetCreatedApplications() 
        {
            var agentId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (agentId == null) return Unauthorized();

            var listOfCreatedAppsByAgentId = await appService.GetCreatedApplicationsByAgentIdAsync(agentId);

            return Ok(listOfCreatedAppsByAgentId);
        }

        [HttpGet("GetSubmittedApplications")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> GetSubmittedApplications() 
        {
            var agentId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (agentId == null) return Unauthorized();

            var listOfSubmittedAppsByAgentId = await appService.GetSubmittedApplicationsByAgentIdAsync(agentId);

            return Ok(listOfSubmittedAppsByAgentId);
        }

        [HttpPost]
        [Authorize(Roles = "Agent")]
        [RequestSizeLimit(50_000_000)]
        public async Task<IActionResult> Create(
            [FromForm] ProjectApplicationModel model,
            [FromForm] List<IFormFile> files)
        {
            var agentId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (agentId == null) return Unauthorized();

            var appResult = await appService.CreateApplicationAsync(agentId, model);

            // Save Files
            if (files != null && files.Count > 0)
            {
               await HandleFileSaving(appResult.Id, files);
            }

            return Ok(new { appResult.Id, appResult.Title });
        }

        [HttpGet("GetApplicationById/{id:int}")]
        [Authorize(Roles = "Agent")]
        public async Task<ActionResult<ProjectApplicationDetailsModel>> GetApplicationById(int id)
        {
            var application = await appService.GetApplicationByIdAsync(id);
            if (application == null)
                return NotFound();

            return Ok(application);
        }

        [HttpPost("UpdateApplication/{id:int}")]
        [Authorize(Roles = "Agent")]
        public async Task<ActionResult> UpdateApplication([FromForm] ProjectApplicationDetailsModel model, [FromForm] List<IFormFile> files, [FromRoute] int id)
        {
            var application = await appService.GetApplicationByIdAsync(id);
            if (application == null)
                return NotFound();

            // Update application details
            var applicationId = await appService.UpdateApplicationAsync(model, id);

            if (applicationId == 0)
            {
                return NotFound();
            }

            // Handle new file uploads
            // Removing Old Files
            var oldFiles = await appService.GetFilesByApplicationId(id);
            if (oldFiles != null && oldFiles.Count > 0)
            {
                foreach (var file in oldFiles)
                {
                    var absolutePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", file.FilePath);
                    if (System.IO.File.Exists(absolutePath))
                    {
                        System.IO.File.Delete(absolutePath);
                    }
                }

                await appService.RemoveApplicationFilesAsync(oldFiles);
            }

            // New Files Saving
            if (files != null && files.Count > 0)
            {
                await HandleFileSaving(applicationId, files);
            }

            return Ok(applicationId);
        }

        private async Task HandleFileSaving(int appId, List<IFormFile> files)
        {
            if (files != null && files.Count != 0)
            {
                var filesToSave = new List<ApplicationFileModel>();
                foreach (var file in files)
                {
                    if (file.Length > 0)
                    {
                        var uploadsFolder = Path.Combine("wwwroot", "uploads", appId.ToString());
                        if (!Directory.Exists(uploadsFolder))
                            Directory.CreateDirectory(uploadsFolder);

                        var filePath = Path.Combine(uploadsFolder, file.FileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        var relativePath = Path.Combine("uploads", appId.ToString(), file.FileName);
                        var fileToSave = new ApplicationFileModel()
                        {
                            FileName = file.FileName,
                            FilePath = relativePath,
                            UploadedAt = DateTime.Now,
                        };

                        filesToSave.Add(fileToSave);
                    }
                }

                if (filesToSave != null && filesToSave.Count > 0)
                    await appService.SaveApplicationFilesAsync(appId, filesToSave);
            }
        }
    }
}
