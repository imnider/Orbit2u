using CloudinaryDotNet;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Sinks.MSSqlServer;
using YoutubeClone.Application.Helpers;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.Services;
using YoutubeClone.Application.Services;
using YoutubeClone.Domain.Database;
using YoutubeClone.Domain.Database.SqlServer.Context;
using YoutubeClone.Domain.Exceptions;
using YoutubeClone.Domain.Interfaces.Repositories;
using YoutubeClone.Infrastructure.Persistence.Cloudinary.Services;
using YoutubeClone.Infrastructure.Persistence.SqlServer;
using YoutubeClone.Infrastructure.Persistence.SqlServer.Repositories;
using YoutubeClone.Shared;
using YoutubeClone.Shared.Constants;
using YoutubeClone.WebApp.Middlewares;

namespace YoutubeClone.WebApp.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddScoped<ICacheService, CacheService>();
            services.AddScoped<IStorageService, StorageService>();
            services.AddScoped<IAuthServices, AuthService>();
            services.AddScoped<IAppService, AppService>();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IUserPreferenceService, UserPreferenceService>();
            services.AddScoped<IChannelService, ChannelService>();
            services.AddScoped<IVideoService, VideoService>();
            services.AddScoped<ISubscriptionService, SubscriptionService>();
            services.AddScoped<IMembershipPlanService, MembershipPlanService>();
            services.AddScoped<ICoinPackageService, CoinPackageService>();
            services.AddScoped<ICommunityService, CommunityService>();
            services.AddScoped<ICommunityMemberService, CommunityMemberService>();
            services.AddScoped<IWalletService, WalletService>();
            services.AddScoped<ITagService, TagService>();
            services.AddScoped<IEmailTemplateService, EmailTemplateService>();
        }

        public static void AddRepositories(this IServiceCollection services)
        {

            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IChannelRepository, ChannelRepository>();
            services.AddScoped<IVideoRepository, VideoRepository>();
            services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
            services.AddScoped<ICommunityRepository, CommunityRepository>();
            services.AddScoped<ICommunityMemberRepository, CommunityMemberRepository>();
            services.AddScoped<ITagRepository, TagRepository>();
            services.AddScoped<IEmailTemplateRepository, EmailTemplateRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IUserWalletRepository, UserWalletRepository>();
            services.AddScoped<ICoinPackageRepository, CoinPackageRepository>();
            services.AddScoped<IMembershipPlanRepository, MembershipPlanRepository>();
            services.AddScoped<IUserPreferenceRepository, UserPreferenceRepository>();
            services.AddScoped<IUserPreferenceTagRepository, UserPreferenceTagRepository>();
        }

        public static void AddMiddlewares(this IServiceCollection services)
        {
            services.AddScoped<ErrorHandleMiddleware>();
        }

        public static void AddLogging(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSerilog();

            var databaseConnectionString = Environment.GetEnvironmentVariable(EnvironmentConstants.CONNECTION_STRING_DATABASE)
                    ?? configuration[ConfigurationConstants.CONNECTION_STRING_DATABASE];
            services.AddSqlServer<Orbit2uContext>(databaseConnectionString);

            Log.Logger = new LoggerConfiguration()
                .WriteTo
                .MSSqlServer(
                    connectionString: databaseConnectionString,
                    sinkOptions: new MSSqlServerSinkOptions
                    {
                        TableName = "LogEvents",
                        AutoCreateSqlTable = true
                    })
                .WriteTo.Console()
                .WriteTo.File(Path.Combine(Directory.GetCurrentDirectory(), "logs", "log.txt"), rollingInterval: RollingInterval.Day)
                .CreateLogger();
        }

        public async static Task AddSMTP(this IServiceCollection services, IConfiguration configuration)
        {
            var host = Environment.GetEnvironmentVariable(EnvironmentConstants.SMTP_HOST)
                ?? configuration[ConfigurationConstants.SMTP_HOST]
                ?? throw new Exception(ResponseConstants.ConfigurationPropertyNotFound(ConfigurationConstants.SMTP_HOST));

            var from = Environment.GetEnvironmentVariable(EnvironmentConstants.SMTP_FROM)
                ?? configuration[ConfigurationConstants.SMTP_FROM]
                ?? throw new Exception(ResponseConstants.ConfigurationPropertyNotFound(ConfigurationConstants.SMTP_FROM));

            var portValue = Environment.GetEnvironmentVariable(EnvironmentConstants.SMTP_PORT)
                ?? configuration[ConfigurationConstants.SMTP_PORT];

            var port = Convert.ToInt32(portValue ?? "587");

            var user = Environment.GetEnvironmentVariable(EnvironmentConstants.SMTP_USER)
                ?? configuration[ConfigurationConstants.SMTP_USER]
                ?? throw new Exception(ResponseConstants.ConfigurationPropertyNotFound(ConfigurationConstants.SMTP_USER));

            var password = Environment.GetEnvironmentVariable(EnvironmentConstants.SMTP_PASSWORD)
                ?? configuration[ConfigurationConstants.SMTP_PASSWORD]
                ?? throw new Exception(ResponseConstants.ConfigurationPropertyNotFound(ConfigurationConstants.SMTP_PASSWORD));

            var smtp = new SMTP(host, from, port, user, password);
            services.AddSingleton(smtp);
        }

        public static void AddCloudinary(this IServiceCollection services, IConfiguration configuration)
        {
            var cloudName = Environment.GetEnvironmentVariable(EnvironmentConstants.CLOUDINARY_CLOUD_NAME)
                ?? configuration[ConfigurationConstants.CLOUDINARY_CLOUD_NAME]
                ?? throw new Exception(ResponseConstants.ConfigurationPropertyNotFound(ConfigurationConstants.CLOUDINARY_CLOUD_NAME));

            var apiKey = Environment.GetEnvironmentVariable(EnvironmentConstants.CLOUDINARY_API_KEY)
                ?? configuration[ConfigurationConstants.CLOUDINARY_API_KEY]
                ?? throw new Exception(ResponseConstants.ConfigurationPropertyNotFound(ConfigurationConstants.CLOUDINARY_API_KEY));

            var apiSecret = Environment.GetEnvironmentVariable(EnvironmentConstants.CLOUDINARY_API_SECRET)
                ?? configuration[ConfigurationConstants.CLOUDINARY_API_SECRET]
                ?? throw new Exception(ResponseConstants.ConfigurationPropertyNotFound(ConfigurationConstants.CLOUDINARY_API_SECRET));

            var account = new Account(
                cloudName,
                apiKey,
                apiSecret);

            var cloudinary = new Cloudinary(account);

            services.AddSingleton<ICloudinary>(cloudinary);
        }

        public async static Task Initialize(this IServiceCollection services)
        {
            var templatesData = new EmailTemplateData();
            services.AddSingleton(templatesData);

            var provider = services.BuildServiceProvider();
            var scope = provider.CreateAsyncScope();

            var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
            await userService.CreateFirstUser();

            var emailTemplateService = scope.ServiceProvider.GetRequiredService<IEmailTemplateService>();
            await emailTemplateService.Init();
        }

        public static void AddAuth(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(builder =>
            {
                builder.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                builder.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(builder =>
            {
                var tokenConfiguration = TokenHelper.Configuration(configuration);

                builder.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = tokenConfiguration.Issuer,
                    ValidateAudience = true,
                    ValidAudience = tokenConfiguration.Audience,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = tokenConfiguration.SecurityKey,
                    ClockSkew = TimeSpan.Zero
                };

                builder.Events = new JwtBearerEvents
                {
                    OnChallenge = async context =>
                    {
                        throw new UnauthorizedException(ResponseConstants.AUTH_TOKEN_NOT_FOUND);
                    }
                };
            });

            services.AddAuthorization();
        }

        public static void AddCache(this IServiceCollection services)
        {
            services.AddMemoryCache();
        }

        public static async Task AddCore(this IServiceCollection services, IConfiguration configuration)
        {
            await services.AddSMTP(configuration);

            services.AddCloudinary(configuration);

            services.AddControllers().ConfigureApiBehaviorOptions(option =>
            {
                option.InvalidModelStateResponseFactory = (errorContext) =>
                {
                    var errors = errorContext.ModelState.Values.SelectMany(value => value.Errors.Select(error => error.ErrorMessage).ToList()).ToList();
                    var response = ResponseHelper.Create(
                        data: ValidationConstants.VALIDATION_MESSAGE,
                        errors: errors,
                        message: ValidationConstants.VALIDATION_MESSAGE);
                    return new BadRequestObjectResult(response);
                };
            });

            services.AddOpenApi();

            // SQL Server
            var databaseConnectionString = Environment.GetEnvironmentVariable(EnvironmentConstants.CONNECTION_STRING_DATABASE)
                    ?? configuration[ConfigurationConstants.CONNECTION_STRING_DATABASE];
            services.AddSqlServer<Orbit2uContext>(databaseConnectionString);

            // Database - Repositories
            services.AddRepositories();

            // Services
            services.AddServices();

            // Middlewares
            services.AddMiddlewares();

            // Serilog
            services.AddLogging(configuration);

            //Cache
            services.AddCache();

            // Auth
            services.AddAuth(configuration);

            // Inicializar primer usuario
            await Initialize(services);
        }
    }
}
