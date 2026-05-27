using System.ComponentModel.DataAnnotations;
using YoutubeClone.Shared.Constants;

namespace YoutubeClone.Application.Models.Requests.Auth.Recover_Password
{
    public class RecoverPasswordAuthRequest
    {
        [Required(ErrorMessage = ValidationConstants.REQUIRED)]
        [MaxLength(255, ErrorMessage = ValidationConstants.MAX_LENGTH)]
        [MinLength(10, ErrorMessage = ValidationConstants.MIN_LENGTH)]
        public string NewPassword { get; set; } = null!;
    }
}
