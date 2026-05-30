using Microsoft.AspNetCore.Mvc;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.WebApp.Helpers;

namespace YoutubeClone.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StorageController(IStorageService storageService) : ControllerBase
    {
        [HttpPost("image")]
        [EndpointSummary("Subir imágenes")]
        [EndpointDescription("Sube una imagen a Cloudinary y retorna la URL")]
        [ProducesResponseType<GenericResponse<FileUploadResponse>>(StatusCodes.Status201Created)]
        public async Task<GenericResponse<FileUploadResponse>> UploadImage([FromForm] IFormFile file)
        {
            var rsp = await storageService.UploadImageAsync(file);
            return ResponseStatus.Created(HttpContext, rsp);
        }
    }
}
