using System.ComponentModel.DataAnnotations;
using YoutubeClone.Shared.Constants;

namespace YoutubeClone.Application.Models.Requests.Auth.Recover_Password
{
    public class RecoverPasswordSendOTPAuthRequest
    {
        [Required(ErrorMessage = ValidationConstants.REQUIRED)]
        [EmailAddress(ErrorMessage = ValidationConstants.EMAIL)]
        [MaxLength(255, ErrorMessage = ValidationConstants.MAX_LENGTH)]
        [MinLength(10, ErrorMessage = ValidationConstants.MIN_LENGTH)]
        public string Email { get; set; } = null!;
    }
}
