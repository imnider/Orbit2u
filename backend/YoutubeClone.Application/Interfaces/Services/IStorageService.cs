using Microsoft.AspNetCore.Http;
using YoutubeClone.Application.Models.Responses;

namespace YoutubeClone.Application.Interfaces.Services
{
    public interface IStorageService
    {
        Task<GenericResponse<FileUploadResponse>> UploadImageAsync(IFormFile file);
        Task<GenericResponse<FileUploadResponse>> UploadVideoAsync(IFormFile file);
        Task<GenericResponse<bool>> DeleteAsync(string publicId);
    }
}
