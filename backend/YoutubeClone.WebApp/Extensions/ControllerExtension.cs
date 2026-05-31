using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using YoutubeClone.Domain.Exceptions;
using YoutubeClone.Shared.Constants;

namespace YoutubeClone.WebApp.Extensions
{
    public static class ControllerExtension
    {
        public static Claim UserClaim(this ControllerBase controller)
        {
            return controller.User.FindFirst(ClaimsConstants.USER_ID)
                ?? throw new BadRequestException(ResponseConstants.AUTH_CLAIM_USER_NOT_FOUND);
        }
    }
}
