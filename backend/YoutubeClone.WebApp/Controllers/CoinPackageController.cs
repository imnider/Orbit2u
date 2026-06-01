using Microsoft.AspNetCore.Mvc;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.WebApp.Helpers;

namespace YoutubeClone.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoinPackageController(ICoinPackageService coinPackageService) : ControllerBase
    {
        [HttpGet]
        [EndpointSummary("Obtener todos los paquetes de coins")]
        [EndpointDescription("Retorna todos los paquetes de coins disponibles ordenados por precio")]
        [ProducesResponseType<GenericResponse<List<CoinPackageDto>>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<CoinPackageDto>>> GetAll()
        {
            var rsp = await coinPackageService.GetAll();
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpGet("{id:int}")]
        [EndpointSummary("Obtener paquete de coins por ID")]
        [EndpointDescription("Retorna un paquete de coins específico por su identificador")]
        [ProducesResponseType<GenericResponse<CoinPackageDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<CoinPackageDto>> GetById(int id)
        {
            var rsp = await coinPackageService.GetById(id);
            return ResponseStatus.Ok(HttpContext, rsp);
        }
    }
}
