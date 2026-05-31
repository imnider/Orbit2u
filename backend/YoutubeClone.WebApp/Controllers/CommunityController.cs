using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.Community;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.WebApp.Extensions;
using YoutubeClone.WebApp.Helpers;

namespace YoutubeClone.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommunityController(ICommunityService communityService) : ControllerBase
    {
        [HttpPost]
        [Authorize]
        [EndpointSummary("Crear comunidad")]
        [EndpointDescription("Crea una comunidad para el usuario autenticado")]
        [ProducesResponseType<GenericResponse<CommunityDto>>(StatusCodes.Status201Created)]
        public async Task<GenericResponse<CommunityDto>> Create([FromBody] CreateCommunityRequest model)
        {
            var rsp = await communityService.Create(model, this.UserClaim());
            return ResponseStatus.Created(HttpContext, rsp);
        }

        [HttpGet]
        [EndpointSummary("Obtener todas las comunidades")]
        [EndpointDescription("Retorna todas las comunidades del sistema")]
        [ProducesResponseType<GenericResponse<List<CommunityDto>>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<CommunityDto>>> GetAll([FromQuery] FilterCommunityRequest model)
        {
            var rsp = await communityService.GetAll(model);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpGet("{id:guid}")]
        [EndpointSummary("Obtener comunidad por ID")]
        [EndpointDescription("Retorna una comunidad específica usando su identificador")]
        [ProducesResponseType<GenericResponse<CommunityDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<CommunityDto>> GetById(Guid id)
        {
            var rsp = await communityService.GetById(id);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpGet("me")]
        [Authorize]
        [EndpointSummary("Mis comunidades")]
        [EndpointDescription("Retorna las comunidades creadas por el usuario autenticado")]
        [ProducesResponseType<GenericResponse<List<CommunityDto>>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<CommunityDto>>> GetMyCommunities()
        {
            var rsp = await communityService.GetMyCommunities(this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpGet("{id:guid}/videos")]
        [EndpointSummary("Videos de una comunidad")]
        [EndpointDescription("Retorna todos los videos pertenecientes a una comunidad")]
        [ProducesResponseType<GenericResponse<List<VideoDto>>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<VideoDto>>> GetVideos(Guid id)
        {
            var rsp = await communityService.GetVideos(id);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpPut("{id:guid}")]
        [Authorize]
        [EndpointSummary("Actualizar comunidad")]
        [EndpointDescription("Actualiza una comunidad perteneciente al usuario autenticado")]
        [ProducesResponseType<GenericResponse<CommunityDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<CommunityDto>> Update(
            Guid id,
            [FromBody] UpdateCommunityRequest model)
        {
            var rsp = await communityService.Update(id, model, this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpDelete("{id:guid}")]
        [Authorize]
        [EndpointSummary("Eliminar comunidad")]
        [EndpointDescription("Elimina una comunidad perteneciente al usuario autenticado")]
        [ProducesResponseType<GenericResponse<bool>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<bool>> Delete(Guid id)
        {
            var rsp = await communityService.Delete(id, this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }
    }
}
