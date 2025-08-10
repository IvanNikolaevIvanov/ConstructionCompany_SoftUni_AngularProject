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

        [HttpGet("GetApplicationsByStatus/{statusId:int}")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> GetApplicationsByStatus(int statusId)
        {
            var agentId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (agentId == null) return Unauthorized();

            var listAppsByStatusAndAgentId = await appService.GetApplicationsByByStatusAndAgentIdAsync(statusId, agentId);

            return Ok(listAppsByStatusAndAgentId);
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

        [HttpPost("Create")]
        [Authorize(Roles = "Agent")]
        [RequestSizeLimit(50_000_000)]
        public async Task<IActionResult> Create(
            [FromForm] ProjectApplicationModel model,
            [FromForm] List<IFormFile> files)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                .Where(e => e.Value.Errors.Count > 0)
                .Select(e => new { Field = e.Key, Errors = e.Value.Errors.Select(er => er.ErrorMessage) });
                return BadRequest(errors);
            }


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
        public async Task<IActionResult> UpdateApplication([FromForm] ProjectApplicationDetailsModel model, [FromForm] List<IFormFile> files, [FromRoute] int id)
        {
            var ifExists = await appService.ApplicationExist(id);
            if (ifExists == false)
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

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            var ifExists = await appService.ApplicationExist(id);
            if (!ifExists)
            {
                return NotFound(new { success = false, message = $"Application with id: {id} not found." });
            }

            var result = await appService.DeleteApplicationAsync(id);
            if (!result)
            {
                return StatusCode(500, new { success = false, message = "Failed to delete application due to server error." });
            }
            
            return Ok(new { success = true, message = $"Application with id {id} deleted successfully." });
        }

        [HttpGet("GetSupervisors")]
        [Authorize(Roles = "Agent")]
        public async Task<ActionResult<ApplicationUserModel>> GetSupervisors()
        {
            try
            {
                var list = await appService.GetSupervisorsAsync();

                return Ok(list);
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpPost("SubmitApplication/{id:int}")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> SubmitApplication([FromRoute] int id, [FromBody] string supervisorId)
        {
            try
            {
                var ifAppExists = await appService.ApplicationExist(id);
                if (ifAppExists == false)
                    return NotFound($"Application with id: {id} not found.");

                var isSupervisorExists = await appService.SupervisorExists(supervisorId);
                if (isSupervisorExists == false)
                    return NotFound($"Supervisor with id: {supervisorId} not found.");

                var result = await appService.SubmitApplicationAsync(id, supervisorId);
                if (!result)
                {
                    return StatusCode(500, new { success = false, message = "Failed to submit application due to server error." });
                }

                return Ok(new { success = true, message = $"Application with id {id} submitted successfully." });
            }
            catch (Exception)
            {

                throw;
            }
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
