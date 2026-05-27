using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.Auth;
using YoutubeClone.Application.Models.Requests.Auth.Recover_Password;
using YoutubeClone.Application.Models.Requests.Auth.Register;
using YoutubeClone.Application.Models.Requests.Users;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Application.Models.Responses.Auth;
using YoutubeClone.Application.Models.Responses.Auth.Register;
using YoutubeClone.Domain.Exceptions;
using YoutubeClone.Shared.Constants;
using YoutubeClone.WebApp.Helpers;

namespace YoutubeClone.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthServices service) : ControllerBase
    {
        [HttpPost("register/init")]
        [EndpointSummary("1. Inicio del registro")]
        [EndpointDescription("Se inicializa la petición para el registro de un nuevo usuario.")]
        [ProducesResponseType<GenericResponse<string>>(StatusCodes.Status201Created)]
        public async Task<GenericResponse<string>> RegisterInit([FromBody] RegisterInitAuthRequest model)
        {
            var srv = await service.RegisterInit(model);
            return ResponseStatus.Created(HttpContext, srv);
        }

        [HttpGet("register/validate/{token}")]
        [EndpointSummary("2. Validar token del registro")]
        [EndpointDescription("Se valida que el token de creación del usuario sea válido")]
        [ProducesResponseType<GenericResponse<RegisterInitAuthResponse>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<RegisterInitAuthResponse>> RegisterValidateToken(string token)
        {
            var srv = await service.RegisterValidateToken(token);
            return ResponseStatus.Created(HttpContext, srv);
        }

        [HttpPost("register/complete/{token}")]
        [EndpointSummary("3. Completar registo")]
        [EndpointDescription("Se completa el registro y se crea el usuario nuevo")]
        [ProducesResponseType<GenericResponse<UserDto>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<UserDto>> RegisterValidateToken([FromBody] CreateUserRequest model, string token)
        {
            var srv = await service.RegisterComplete(model, token);
            return ResponseStatus.Created(HttpContext, srv);
        }

        [HttpPost("recoverPassword")]
        [EndpointSummary("1. Enviar OTP")]
        [EndpointDescription("Se envía un OTP (enlace) por correo electrónico para recuperar contraseña")]
        [ProducesResponseType<GenericResponse<string>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<string>> RecoverPasswordSendOTP([FromBody] RecoverPasswordSendOTPAuthRequest model)
        {
            var srv = await service.RecoverPasswordSendOTP(model);
            return ResponseStatus.Created(HttpContext, srv);
        }

        [HttpPost("recoverPassword/{code}")]
        [EndpointSummary("2. Recuperar contraseña")]
        [EndpointDescription("El usuario coloca la nueva contraseña y la cambia")]
        [ProducesResponseType<GenericResponse<string>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<string>> RecoverPassword([FromBody] RecoverPasswordAuthRequest model, string code)
        {
            var srv = await service.RecoverPassword(model, code);
            return ResponseStatus.Created(HttpContext, srv);
        }

        [HttpPost("changePassword")]
        [EndpointSummary("Cambiar contraseña")]
        [EndpointDescription("El usuario envía su contraseña actual y la nueva para cambiarla")]
        [ProducesResponseType<GenericResponse<string>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<string>> ChangePassword([FromBody] ChangePasswordAuthRequest model)
        {
            var srv = await service.ChangePassword(model, UserClaim());
            return ResponseStatus.Created(HttpContext, srv);
        }

        [HttpPost("login")]
        [EndpointSummary("Iniciar Sesión")]
        [EndpointDescription("El usuario envía sus datos de inicio de sesión y se genera un token JWT para mantener la sesión iniciada, y otro token para refrescar la sesión.")]
        [ProducesResponseType<GenericResponse<LoginAuthResponse>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<LoginAuthResponse>> Login([FromBody] LoginAuthRequest model)
        {
            var rsp = await service.Login(model);
            return ResponseStatus.Created(HttpContext, rsp);
        }

        [HttpPost("renew")]
        [EndpointSummary("Renovar sesión actual")]
        [EndpointDescription("Se consume el token para refrescar la sesión y se genera uno nuevo")]
        [ProducesResponseType<GenericResponse<LoginAuthResponse>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<LoginAuthResponse>> Renew([FromBody] RenewAuthRequest model)
        {
            var rsp = await service.Renew(model);
            return ResponseStatus.Created(HttpContext, rsp);
        }

        private Claim UserClaim()
        {
            return User.FindFirst(ClaimsConstants.USER_ID)
                ?? throw new BadRequestException(ResponseConstants.AUTH_CLAIM_USER_NOT_FOUND);
        }
    }
}
