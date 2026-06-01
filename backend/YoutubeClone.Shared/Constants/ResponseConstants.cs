namespace YoutubeClone.Shared.Constants
{
    public static class ResponseConstants
    {
        // Usuarios
        public const string USER_NOT_EXIST = "El usuario no existe";
        public const string USER_EMAIL_TAKED = "Ya existe un usuario con este correo";
        public const string USER_WITHOUT_PERMISSIONS = "No tienes los permisos para modificar otros usuarios.";
        // Canales
        public const string CHANNEL_NOT_EXIST = "El canal no existe";

        // Videos
        public const string USER_WITHOUT_CHANNEL = "Debes crear un canal antes de publicar videos";
        public const string VIDEO_NOT_EXIST = "El video no existe";
        public const string VIDEO_WITHOUT_PERMISSIONS = "No tienes permisos para modificar este video.";
        public const string VIDEO_NEED_CHANNEL = "Debes crear un canal antes de gestionar videos.";

        // Comunidades
        public const string COMMUNITY_NOT_EXIST = "La comunidad no existe";
        public const string COMMUNITY_WITHOUT_PERMISSIONS = "No tienes permisos para modificar esta comunidad.";

        // Roles
        public static string RoleNotFound(string name) => $"El rol {name} no existe";
        public static string RoleNotFound(Guid id) => $"El rol con ID: {id} no existe";
        public const string CANNOT_ASSIGN_THE_ROLE = "No puede asignar el rol que argumentó";
        public const string ROLE_WITHOUT_PERMISSIONS = "No tienes los permisos para modificar roles";

        // Membresías
        public static string MembershipNotFound(int id) => $"La membresía con ID: {id} no existe";
        public const string MEMBERSHIP_WITHOUT_PERMISSIONS = "No tienes los permisos para modificar membresías";

        // Paquetes
        public static string PackageCoinNotFount(int id) => $"El paquete de monedas con ID: {id} no existe";

        // Auth - Token
        public const string AUTH_TOKEN_NOT_FOUND = "El token no es correcto o expiró";
        public const string AUTH_USER_OR_PASSWORD_NOT_FOUND = "Usuario o contraseña incorrectos";
        public const string AUTH_REFRESH_TOKEN_NOT_FOUND = "El token para refrescar la sesión expiró, no existe o es incorrecto";
        public const string AUTH_CLAIM_USER_NOT_FOUND = "No pudo ser validada la identidad del usuario";

        public static string ErrorUnexpected(string traceId)
        {
            return $"Ha ocurrido un error inesperado: Contacte con soporte, mencionando el siguiente código de error: {traceId}";
        }

        public static string ConfigurationPropertyNotFound(string property)
        {
            return $"Falta la propiedad '{property}' por establecer en la configuración del aplicativo.";
        }
    }
}
