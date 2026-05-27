using System.Security.Claims;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.Auth;
using YoutubeClone.Application.Models.Requests.Auth.Recover_Password;
using YoutubeClone.Application.Models.Requests.Auth.Register;
using YoutubeClone.Application.Models.Requests.Users;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Application.Models.Responses.Auth;
using YoutubeClone.Application.Models.Responses.Auth.Register;

namespace YoutubeClone.Application.Interfaces.Services
{
    public interface IAuthServices
    {
        Task<GenericResponse<string>> RegisterInit(RegisterInitAuthRequest model);
        Task<GenericResponse<RegisterInitAuthResponse>> RegisterValidateToken(string token);
        Task<GenericResponse<UserDto>> RegisterComplete(CreateUserRequest model, string token);
        Task<GenericResponse<string>> RecoverPasswordSendOTP(RecoverPasswordSendOTPAuthRequest model);
        Task<GenericResponse<string>> RecoverPassword(RecoverPasswordAuthRequest model, string code);
        Task<GenericResponse<string>> ChangePassword(ChangePasswordAuthRequest model, Claim claim);
        Task<GenericResponse<LoginAuthResponse>> Login(LoginAuthRequest model);
        Task<GenericResponse<LoginAuthResponse>> Renew(RenewAuthRequest model);
    }
}
