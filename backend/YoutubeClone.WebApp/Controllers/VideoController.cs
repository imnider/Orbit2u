using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.Videos;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.WebApp.Extensions;
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
            var rsp = await videoService.Create(model, this.UserClaim());
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

        [HttpGet("me")]
        [Authorize]
        [EndpointSummary("Obtener mis videos")]
        [EndpointDescription("Retorna todos los videos del usuario autenticado")]
        [ProducesResponseType<GenericResponse<List<VideoDto>>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<VideoDto>>> GetMyVideos()
        {
            var rsp = await videoService.GetOfCurrentUser(this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpPut("{id:guid}")]
        [Authorize]
        [EndpointSummary("Actualizar video")]
        [EndpointDescription("Actualiza un video perteneciente al usuario autenticado")]
        [ProducesResponseType<GenericResponse<VideoDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<VideoDto>> Update(Guid id, [FromBody] UpdateVideoRequest model)
        {
            var rsp = await videoService.Update(id, model, this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpDelete("{id:guid}")]
        [Authorize]
        [EndpointSummary("Eliminar video")]
        [EndpointDescription("Elimina un video usando su identificador único")]
        [ProducesResponseType<GenericResponse<bool>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<bool>> Delete(Guid id)
        {
            var rsp = await videoService.Delete(id, this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }
    }
}
