using Microsoft.AspNetCore.Mvc;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.WebApp.Helpers;

namespace YoutubeClone.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppController(IAppService appService) : ControllerBase
    {
        [HttpGet("info")]
        [EndpointSummary("Información de la aplicación")]
        [EndpointDescription("Los roles, permisos, versión y otros detalles de la aplicación")]
        [ProducesResponseType<GenericResponse<AppInfoDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<AppInfoDto>> Info()
        {
            var rsp = await appService.Info();
            return ResponseStatus.Ok(HttpContext, rsp);
        }
    }
}
