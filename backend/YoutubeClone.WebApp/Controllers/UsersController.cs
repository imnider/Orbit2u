using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.Users;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Domain.Exceptions;
using YoutubeClone.Shared.Constants;
using YoutubeClone.WebApp.Helpers;

namespace YoutubeClone.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(IUserService userService) : ControllerBase
    {
        [HttpGet("me")]
        [Authorize]
        [EndpointSummary("Información del usuario logeado")]
        [EndpointDescription("Retorna al usuario que ha iniciado sesión.")]
        [ProducesResponseType<GenericResponse<UserDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<UserDto>> Me()
        {
            var rsp = await userService.Me(UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpPost]
        [Authorize(Roles = RoleConstants.Administrador)]
        [EndpointSummary("Crear usuario")]
        [EndpointDescription("Crea un usuario en el sistema")]
        [ProducesResponseType<GenericResponse<UserDto>>(StatusCodes.Status201Created)]
        public async Task<GenericResponse<UserDto>> Create([FromBody] CreateUserRequest model)
        {
            var rsp = await userService.Create(model, UserClaim());
            return ResponseStatus.Created(HttpContext, rsp);
        }

        [HttpGet]
        [Authorize]
        [EndpointSummary("Obtener todos los usuarios")]
        [EndpointDescription("Retorna todos los usuarios del sistema")]
        [ProducesResponseType<GenericResponse<UserDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<UserDto>>> GetAll([FromQuery] FilterUserRequest model)
        {
            var rsp = await userService.GetAll(model);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpGet("{id:guid}")]
        [Authorize]
        [EndpointSummary("Obtener usuario por ID")]
        [EndpointDescription("Retorna un usuario específico usando el identificador único")]
        [ProducesResponseType<GenericResponse<UserDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<UserDto>> GetById(Guid id)
        {
            var rsp = await userService.GetById(id);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = RoleConstants.Administrador)]
        [EndpointSummary("Borrar usuario por ID")]
        [EndpointDescription("Borra un usuario en específico usando su identificador único")]
        [ProducesResponseType<GenericResponse<UserDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<bool>> Delete(Guid id)
        {
            var rsp = await userService.Delete(id);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Roles = RoleConstants.Administrador)]
        [EndpointSummary("Actualizar usuario por ID")]
        [EndpointDescription("Actualiza los datos de un usuario en específico usando su identificador único")]
        [ProducesResponseType<GenericResponse<UserDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<UserDto>> Update(Guid id, UpdateUserRequest model)
        {
            var rsp = await userService.Update(id, model, UserClaim());
            return ResponseStatus.Updated(HttpContext, rsp);
        }

        // MÉTODOS PRIVADOS
        private Claim UserClaim()
        {
            return User.FindFirst(ClaimsConstants.USER_ID)
                ?? throw new BadRequestException(ResponseConstants.AUTH_CLAIM_USER_NOT_FOUND);
        }
    }
}
