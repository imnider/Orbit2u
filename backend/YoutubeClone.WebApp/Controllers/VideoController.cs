using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.Videos;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Domain.Exceptions;
using YoutubeClone.Shared.Constants;
using YoutubeClone.WebApp.Helpers;

namespace YoutubeClone.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoController(IVideoService videoService) : ControllerBase
    {
        [HttpPost]
        [Authorize]
        [EndpointSummary("Crear video")]
        [EndpointDescription("Crea un video para el canal del usuario autenticado")]
        [ProducesResponseType<GenericResponse<VideoDto>>(StatusCodes.Status201Created)]
        public async Task<GenericResponse<VideoDto>> Create([FromBody] CreateVideoRequest model)
        {
            var rsp = await videoService.Create(model, UserClaim());
            return ResponseStatus.Created(HttpContext, rsp);
        }

        [HttpGet]
        [EndpointSummary("Obtener todos los videos")]
        [EndpointDescription("Retorna todos los videos del sistema")]
        [ProducesResponseType<GenericResponse<List<VideoDto>>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<VideoDto>>> GetAll([FromQuery] FilterVideoRequest model)
        {
            var rsp = await videoService.GetAll(model);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpGet("{id:guid}")]
        [EndpointSummary("Obtener video por ID")]
        [EndpointDescription("Retorna un video específico usando su identificador único")]
        [ProducesResponseType<GenericResponse<VideoDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<VideoDto>> GetById(Guid id)
        {
            var rsp = await videoService.GetById(id);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpGet("channel/{channelId:guid}")]
        [EndpointSummary("Obtener videos de un canal")]
        [EndpointDescription("Retorna todos los videos pertenecientes a un canal")]
        [ProducesResponseType<GenericResponse<List<VideoDto>>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<VideoDto>>> GetOfChannel(Guid channelId)
        {
            var rsp = await videoService.GetOfChannel(channelId);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpGet("me")]
        [Authorize]
        [EndpointSummary("Obtener mis videos")]
        [EndpointDescription("Retorna todos los videos del usuario autenticado")]
        [ProducesResponseType<GenericResponse<List<VideoDto>>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<VideoDto>>> GetMyVideos()
        {
            var rsp = await videoService.GetOfCurrentUser(UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpPut("{id:guid}")]
        [Authorize]
        [EndpointSummary("Actualizar video")]
        [EndpointDescription("Actualiza un video perteneciente al usuario autenticado")]
        [ProducesResponseType<GenericResponse<VideoDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<VideoDto>> Update(Guid id, [FromBody] UpdateVideoRequest model)
        {
            var rsp = await videoService.Update(id, model, UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpDelete("{id:guid}")]
        [Authorize]
        [EndpointSummary("Eliminar video")]
        [EndpointDescription("Elimina un video usando su identificador único")]
        [ProducesResponseType<GenericResponse<bool>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<bool>> Delete(Guid id)
        {
            var rsp = await videoService.Delete(id, UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        // PRIVADOS
        private Claim UserClaim()
        {
            return User.FindFirst(ClaimsConstants.USER_ID)
                ?? throw new BadRequestException(ResponseConstants.AUTH_CLAIM_USER_NOT_FOUND);
        }
    }
}
