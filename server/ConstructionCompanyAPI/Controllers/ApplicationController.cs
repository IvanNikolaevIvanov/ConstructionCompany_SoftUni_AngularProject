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
        private readonly ProjectApplicationService appService;

        public ApplicationController(ProjectApplicationService _appService)
        {
            appService = _appService;
        }

        [HttpPost]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> Create([FromBody] ProjectApplicationModel model)
        {
            var agentId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (agentId == null) return Unauthorized();

            var result = await appService.CreateApplicationAsync(agentId, model);
            return Ok(new { result.Id, result.Title });
        }
    }
}
