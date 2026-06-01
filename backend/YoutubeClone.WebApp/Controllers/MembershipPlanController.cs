using Microsoft.AspNetCore.Mvc;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.WebApp.Helpers;

namespace YoutubeClone.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembershipPlanController(IMembershipPlanService membershipPlanService) : ControllerBase
    {
        [HttpGet]
        [EndpointSummary("Obtener todos los planes de membresía")]
        [EndpointDescription("Retorna todos los planes de membresía disponibles")]
        [ProducesResponseType<GenericResponse<List<MembershipPlanDto>>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<MembershipPlanDto>>> GetAll()
        {
            var rsp = await membershipPlanService.GetAll();
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpGet("{id:int}")]
        [EndpointSummary("Obtener plan de membresía por ID")]
        [EndpointDescription("Retorna la información de un plan de membresía específico")]
        [ProducesResponseType<GenericResponse<MembershipPlanDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<MembershipPlanDto>> GetById(int id)
        {
            var rsp = await membershipPlanService.GetById(id);
            return ResponseStatus.Ok(HttpContext, rsp);
        }
    }
}
