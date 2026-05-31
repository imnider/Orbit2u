using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.Requests.Storage;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.WebApp.Helpers;

namespace YoutubeClone.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StorageController(IStorageService storageService) : ControllerBase
    {
        [HttpPost("image")]
        [Authorize]
        [EndpointSummary("Subir imágenes")]
        [EndpointDescription("Sube una imagen a Cloudinary y retorna la URL")]
        [ProducesResponseType<GenericResponse<FileUploadResponse>>(StatusCodes.Status201Created)]
        public async Task<GenericResponse<FileUploadResponse>> UploadImage([FromForm] IFormFile file)
        {
            var rsp = await storageService.UploadImageAsync(file);
            return ResponseStatus.Created(HttpContext, rsp);
        }

        [HttpPost("video")]
        [Authorize]
        [EndpointSummary("Subir videos")]
        [EndpointDescription("Sube un video a Cloudinary y retorna la URL")]
        [ProducesResponseType<GenericResponse<FileUploadResponse>>(StatusCodes.Status201Created)]
        public async Task<GenericResponse<FileUploadResponse>> UploadVideo([FromForm] IFormFile file)
        {
            var rsp = await storageService.UploadVideoAsync(file);
            return ResponseStatus.Created(HttpContext, rsp);
        }

        [HttpDelete]
        [Authorize]
        [EndpointSummary("Eliminar archivos")]
        [EndpointDescription("Elimina archivos de Cloudinary solo enviando un FileUrl")]
        [ProducesResponseType<GenericResponse<bool>>(StatusCodes.Status200OK)]
        public async Task<GenericResponse<bool>> Delete([FromBody] DeleteFileRequest model)
        {
            var rsp = await storageService.DeleteAsync(model);
            return ResponseStatus.Ok(HttpContext, rsp);
        }
    }
}
