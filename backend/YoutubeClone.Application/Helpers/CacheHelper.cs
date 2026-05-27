using Microsoft.Extensions.Configuration;
using YoutubeClone.Application.Models.Helpers;
using YoutubeClone.Shared.Constants;

namespace YoutubeClone.Application.Helpers
{
    public class CacheHelper
    {

        public static string AuthRegisterTokenKey(string value)
        {
            return $"auth:register:tokens:{value}";
        }

        public static CacheKey AuthRegisterTokenCreation(string value, TimeSpan expiration)
        {
            return new CacheKey
            {
                Key = AuthRegisterTokenKey(value),
                Expiration = expiration
            };
        }

        public static string AuthRecoverPasswordOTPKey(string value)
        {
            return $"auth:recover_password:otps:{value}";
        }

        public static CacheKey AuthRecoverPasswordOTPCreation(string value, TimeSpan expiration)
        {
            return new CacheKey
            {
                Key = AuthRecoverPasswordOTPKey(value),
                Expiration = expiration
            };
        }

        public static readonly Random rnd = new();

        public static string AuthTokenKey(string value)
        {
            return $"auth:tokens:{value}";
        }

        public static CacheKey AuthTokenCreation(string value, TimeSpan expiration)
        {
            return new CacheKey
            {
                Key = AuthTokenKey(value),
                Expiration = expiration
            };
        }

        public static string AuthRefreshTokenKey(string value)
        {
            return $"auth:refresh_tokens:{value}";
        }

        public static CacheKey AuthRefreshTokenCreation(string value, IConfiguration configuration)
        {
            return new CacheKey
            {
                Key = AuthRefreshTokenKey(value),
                Expiration = TimeSpan.FromDays(Convert.ToInt32(configuration[ConfigurationConstants.AUTH_REFRESH_TOKEN_EXPIRATION_IN_DAYS] ?? "15"))
            };
        }
    }
}
