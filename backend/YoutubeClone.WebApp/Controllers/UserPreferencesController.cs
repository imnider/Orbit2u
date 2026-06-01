using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.WebApp.Extensions;
using YoutubeClone.WebApp.Helpers;

namespace YoutubeClone.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPreferencesController(IUserPreferenceService userPreferenceService) : ControllerBase
    {
        [HttpPost("tags/{tagId:guid}")]
        [Authorize]
        [EndpointSummary("Agregar tag a preferencias")]
        [EndpointDescription("Agrega un tag a las preferencias del usuario autenticado")]
        [ProducesResponseType<GenericResponse<bool>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<bool>> AddTag(Guid tagId)
        {
            var rsp = await userPreferenceService.AddTag(tagId, this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpDelete("tags/{tagId:guid}")]
        [Authorize]
        [EndpointSummary("Eliminar tag de preferencias")]
        [EndpointDescription("Elimina un tag de las preferencias del usuario autenticado")]
        [ProducesResponseType<GenericResponse<bool>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<bool>> RemoveTag(Guid tagId)
        {
            var rsp = await userPreferenceService.RemoveTag(tagId, this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpGet]
        [Authorize]
        [EndpointSummary("Obtener mis preferencias")]
        [EndpointDescription("Retorna las preferencias del usuario autenticado incluyendo tags")]
        [ProducesResponseType<GenericResponse<UserPreferenceDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<UserPreferenceDto>> GetMyPreferences()
        {
            var rsp = await userPreferenceService.GetMyPreferences(this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }
    }
}
