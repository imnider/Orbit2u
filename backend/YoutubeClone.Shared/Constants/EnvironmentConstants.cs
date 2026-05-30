namespace YoutubeClone.Shared.Constants
{
    public static class EnvironmentConstants
    {
        // SMTP
        public const string SMTP_HOST = "SMTP_HOST";
        public const string SMTP_PORT = "SMTP_PORT";
        public const string SMTP_USER = "SMTP_USER";
        public const string SMTP_PASSWORD = "SMTP_PASSWORD";
        public const string SMTP_FROM = "SMTP_FROM";

        // Database
        public const string CONNECTION_STRING_DATABASE = "CONNECTION_STRING_DATABASE";

        // JWT
        public const string JWT_PRIVATE_KEY = "JWT_PRIVATE_KEY";
        public const string JWT_AUDIENCE = "JWT_AUDIENCE";
        public const string JWT_ISSUER = "JWT_ISSUER";

        // Cloudinary
        public const string CLOUDINARY_CLOUD_NAME = "CLOUDINARY_CLOUD_NAME";
        public const string CLOUDINARY_API_KEY = "CLOUDINARY_API_KEY";
        public const string CLOUDINARY_API_SECRET = "CLOUDINARY_API_SECRET";
    }
}
