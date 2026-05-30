using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using YoutubeClone.Application.Helpers;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Domain.Exceptions;

namespace YoutubeClone.Infrastructure.Persistence.Cloudinary.Services
{
    public class StorageService(ICloudinary cloudinary) : IStorageService
    {
        public async Task<GenericResponse<FileUploadResponse>> UploadImageAsync(IFormFile file)
        {
            if (file.Length <= 0)
            {
                throw new BadRequestException("El archivo está vacío.");
            }

            if (!file.ContentType.StartsWith("image/"))
            {
                throw new BadRequestException("El archivo no es una imagen.");
            }

            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                Folder = "images",
                File = new FileDescription(file.FileName, stream)
            };

            var result = await cloudinary.UploadAsync(uploadParams);

            if (result.Error is not null)
            {
                throw new Exception(result.Error.Message);
            }

            return ResponseHelper.Create(new FileUploadResponse
            {
                Url = result.SecureUrl.ToString(),
                PublicId = result.PublicId,
                FileName = file.FileName
            });
        }

        public async Task<GenericResponse<FileUploadResponse>> UploadVideoAsync(IFormFile file)
        {
            if (file.Length <= 0)
            {
                throw new BadRequestException("El archivo está vacío.");
            }

            if (!file.ContentType.StartsWith("video/"))
            {
                throw new BadRequestException("El archivo no es un video.");
            }

            await using var stream = file.OpenReadStream();

            var uploadParams = new VideoUploadParams
            {
                Folder = "videos",
                File = new FileDescription(file.FileName, stream)
            };

            var result = await cloudinary.UploadAsync(uploadParams);

            if (result.Error is not null)
            {
                throw new Exception(result.Error.Message);
            }

            return ResponseHelper.Create(new FileUploadResponse
            {
                Url = result.SecureUrl.ToString(),
                PublicId = result.PublicId,
                FileName = file.FileName
            });
        }

        public async Task<GenericResponse<bool>> DeleteAsync(string publicId)
        {
            var result = await cloudinary.DestroyAsync(
                new DeletionParams(publicId));

            if (result.Error is not null)
            {
                throw new Exception(result.Error.Message);
            }

            return ResponseHelper.Create(true);
        }
    }
}
