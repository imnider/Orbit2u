using Microsoft.AspNetCore.Mvc;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.WebApp.Helpers;

namespace YoutubeClone.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController(ITagService tagService) : ControllerBase
    {
        [HttpGet]
        [EndpointSummary("Obtener todos los tags")]
        [EndpointDescription("Retorna todos los tags disponibles para asociar a videos")]
        [ProducesResponseType<GenericResponse<List<TagDto>>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<TagDto>>> GetAll()
        {
            var rsp = await tagService.GetAll();
            return ResponseStatus.Ok(HttpContext, rsp);
        }
    }
}
