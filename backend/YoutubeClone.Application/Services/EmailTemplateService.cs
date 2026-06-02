using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Services;
using YoutubeClone.Domain.Database;

namespace YoutubeClone.Application.Services
{
    public class EmailTemplateService(IUnitOfWork uow, EmailTemplateData templateData) : IEmailTemplateService
    {
        public async Task Init()
        {
            var templates = await uow.emailTemplateRepository.Get();
            templateData.Data = templates;
        }

        public async Task<EmailTemplateDto> Get(string name, Dictionary<string, string> variables)
        {
            var template = templateData.Data.First(x => x.Name == name);

            var body = template.Body;

            foreach (var variable in variables)
            {
                body = body.Replace(
                    "{{" + variable.Key + "}}",
                    variable.Value
                );
            }

            return new EmailTemplateDto
            {
                Body = body,
                Subject = template.Subject,
            };
        }
    }
}
