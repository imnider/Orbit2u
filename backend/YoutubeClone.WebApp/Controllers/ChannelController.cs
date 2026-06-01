using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.Channels;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Shared.Constants;
using YoutubeClone.WebApp.Extensions;
using YoutubeClone.WebApp.Helpers;

namespace YoutubeClone.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelController(IChannelService channelService, ISubscriptionService subscriptionService) : ControllerBase
    {
        [HttpPost]
        [Authorize]
        [EndpointSummary("Crear canal")]
        [EndpointDescription("Crea un canal siempre que el usuario esté logeado")]
        [ProducesResponseType<GenericResponse<ChannelDto>>(StatusCodes.Status201Created)]
        public async Task<GenericResponse<ChannelDto>> Create([FromBody] CreateChannelRequest model)
        {
            var rsp = await channelService.Create(model, this.UserClaim());
            return ResponseStatus.Created(HttpContext, rsp);
        }

        [HttpGet]
        [EndpointSummary("Obtener todos los canales")]
        [EndpointDescription("Retorna todos los canales del sistema")]
        [ProducesResponseType<GenericResponse<List<ChannelDto>>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<ChannelDto>>> GetAll([FromQuery] FilterChannelRequest model)
        {
            var rsp = await channelService.GetAll(model);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpGet("{id:guid}")]
        [EndpointSummary("Obtener canal por ID")]
        [EndpointDescription("Retorna un canal específico usando el identificador único")]
        [ProducesResponseType<GenericResponse<ChannelDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<ChannelDto>> GetById(Guid id)
        {
            var rsp = await channelService.GetById(id);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = RoleConstants.Administrador)]
        [EndpointSummary("Borrar canal por ID")]
        [EndpointDescription("Borra un canal en específico usando su identificador único")]
        [ProducesResponseType<GenericResponse<bool>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<bool>> Delete(Guid id)
        {
            var rsp = await channelService.Delete(id);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpPut]
        [Authorize]
        [EndpointSummary("Actualizar canal")]
        [EndpointDescription("Actualiza los datos del canal del usuario logueado")]
        [ProducesResponseType<GenericResponse<ChannelDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<ChannelDto>> Update([FromBody] UpdateChannerlRequest model)
        {
            var rsp = await channelService.Update(model, this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpGet("me")]
        [Authorize]
        [EndpointSummary("Obtener mi canal")]
        [EndpointDescription("Retorna el canal asociado al usuario autenticado")]
        [ProducesResponseType<GenericResponse<ChannelDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<ChannelDto>> GetMine()
        {
            var rsp = await channelService.GetMyChannel(this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpGet("{id:guid}/videos")]
        [EndpointSummary("Videos de un canal")]
        [EndpointDescription("Retorna todos los videos pertenecientes a un canal")]
        [ProducesResponseType<GenericResponse<List<VideoDto>>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<VideoDto>>> GetVideos(Guid id)
        {
            var rsp = await channelService.GetVideos(id);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpPost("{id:guid}/subscribe")]
        [Authorize]
        [EndpointSummary("Suscribirse a un canal")]
        [EndpointDescription("Hace que el usuario logeado se suscriba a un canal")]
        [ProducesResponseType<GenericResponse<bool>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<bool>> Subscribe(Guid id)
        {
            var rsp = await subscriptionService.Subscribe(id, this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpDelete("{id:guid}/subscribe")]
        [Authorize]
        [EndpointSummary("Desuscribirse a un canal")]
        [EndpointDescription("Hace que el usuario logeado se desuscriba a un canal")]
        [ProducesResponseType<GenericResponse<bool>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<bool>> Unsubscribe(Guid id)
        {
            var rsp = await subscriptionService.Unsubscribe(id, this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }
    }
}
