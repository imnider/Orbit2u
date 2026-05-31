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
    public class SubscriptionsController(ISubscriptionService subscriptionService) : ControllerBase
    {
        [HttpDelete("me")]
        [Authorize]
        [EndpointSummary("Canales suscritos")]
        [EndpointDescription("Retorna todos los canales a los que está suscrito el usuario")]
        [ProducesResponseType<GenericResponse<List<ChannelDto>>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<ChannelDto>>> GetMySubscriptions()
        {
            var rsp = await subscriptionService.GetMySubscriptions(this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }
    }
}
