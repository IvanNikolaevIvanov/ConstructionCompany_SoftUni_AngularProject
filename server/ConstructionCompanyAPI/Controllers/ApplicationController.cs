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

            var filePaths = new List<string>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    var uploadsFolder = Path.Combine("wwwroot", "uploads", appResult.Id.ToString());
                    Directory.CreateDirectory(uploadsFolder);

                    var filePath = Path.Combine(uploadsFolder, file.FileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var relativePath = Path.Combine("uploads", appResult.Id.ToString(), file.FileName);
                    filePaths.Add(relativePath);
                }
            }

            //if (filePaths.Any())
            //    await appService.SaveApplicationFilesAsync(appResult.Id, filePaths);

            return Ok(new { appResult.Id, appResult.Title, Files = filePaths });
        }
    }
}
