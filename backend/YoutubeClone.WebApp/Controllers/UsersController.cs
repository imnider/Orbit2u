using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.CoinPackage;
using YoutubeClone.Application.Models.Requests.Users;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Shared.Constants;
using YoutubeClone.WebApp.Extensions;
using YoutubeClone.WebApp.Helpers;

namespace YoutubeClone.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(IUserService userService, IWalletService walletService) : ControllerBase
    {
        [HttpGet("me")]
        [Authorize]
        [EndpointSummary("Información del usuario logeado")]
        [EndpointDescription("Retorna al usuario que ha iniciado sesión.")]
        [ProducesResponseType<GenericResponse<UserDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<UserDto>> Me()
        {
            var rsp = await userService.Me(this.UserClaim());
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpPost]
        [Authorize(Roles = RoleConstants.Administrador)]
        [EndpointSummary("Crear usuario")]
        [EndpointDescription("Crea un usuario en el sistema")]
        [ProducesResponseType<GenericResponse<UserDto>>(StatusCodes.Status201Created)]
        public async Task<GenericResponse<UserDto>> Create([FromBody] CreateUserRequest model)
        {
            var rsp = await userService.Create(model, this.UserClaim());
            return ResponseStatus.Created(HttpContext, rsp);
        }

        [HttpGet]
        [Authorize(Roles = RoleConstants.Administrador)]
        [EndpointSummary("Obtener todos los usuarios")]
        [EndpointDescription("Retorna todos los usuarios del sistema")]
        [ProducesResponseType<GenericResponse<List<UserDto>>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<List<UserDto>>> GetAll([FromQuery] FilterUserRequest model)
        {
            var rsp = await userService.GetAll(model);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpGet("{id:guid}")]
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
        [ProducesResponseType<GenericResponse<bool>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<bool>> Delete(Guid id)
        {
            var rsp = await userService.Delete(id);
            return ResponseStatus.Ok(HttpContext, rsp);
        }

        [HttpPut("{id:guid}")]
        [Authorize]
        [EndpointSummary("Actualizar usuario por ID")]
        [EndpointDescription("Actualiza los datos de un usuario en específico usando su identificador único")]
        [ProducesResponseType<GenericResponse<UserDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<UserDto>> Update(Guid id, [FromBody] UpdateUserRequest model)
        {
            var rsp = await userService.Update(id, model, this.UserClaim());
            return ResponseStatus.Updated(HttpContext, rsp);
        }

        [HttpPost("{userId:guid}/wallet")]
        [Authorize(Roles = RoleConstants.Administrador)]
        [EndpointSummary("Agregar monedas a la billetera de un usuario")]
        [EndpointDescription("Añade monedas a la billetera de un usuario dependiendo del paquete de monedas enviado")]
        [ProducesResponseType<GenericResponse<bool>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<bool>> AddCoins(Guid userId, [FromBody] AddCoinsRequest request)
        {
            var rsp = await walletService.AddCoins(userId, request);
            return ResponseStatus.Ok(HttpContext, rsp);
        }
    }
}
