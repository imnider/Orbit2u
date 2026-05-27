USE master;

CREATE DATABASE Orbit2u
GO

USE Orbit2u
GO

CREATE TABLE UserAccount(
	UserID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
	UserName NVARCHAR(20) NOT NULL UNIQUE,
	Email NVARCHAR(255) NOT NULL UNIQUE,
	DisplayName NVARCHAR (50) NOT NULL,
	Birthday DATETIME2 NOT NULL,
	Location NVARCHAR(30) NOT NULL,
	Password NVARCHAR(255) NOT NULL,
	CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
	UpdatedAt DATETIME2 NULL,
	DeletedAt DATETIME2 NULL,
);
GO

CREATE TABLE Channel(
	ChannelID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
	UserID UNIQUEIDENTIFIER NOT NULL REFERENCES UserAccount(UserID),
	Handle NVARCHAR (20) NOT NULL UNIQUE,
	DisplayName NVARCHAR(50) NOT NULL,
	Verification BIT NOT NULL DEFAULT 0,
	Description NVARCHAR(255) NULL,
	AvatarURL NVARCHAR(255) NULL,
	BannerURL NVARCHAR(255) NULL,
	CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
	UpdatedAt DATETIME2 NULL,
	DeletedAt DATETIME2 NULL,
);
GO

CREATE TABLE Community(
    CommunityID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    OwnerUserID UNIQUEIDENTIFIER NOT NULL REFERENCES UserAccount(UserID),
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(255) NULL,
    AvatarURL NVARCHAR(255) NULL,
    BannerURL NVARCHAR(255) NULL,
    IsPrivate BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    DeletedAt DATETIME2 NULL,
);
GO

CREATE TABLE CommunityMember(
    CommunityMemberID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    CommunityID UNIQUEIDENTIFIER NOT NULL REFERENCES Community(CommunityID),
    UserID UNIQUEIDENTIFIER NOT NULL REFERENCES UserAccount(UserID),
    IsModerator BIT NOT NULL DEFAULT 0,
    JoinedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_CommunityMember UNIQUE (CommunityID, UserID)
);
GO

CREATE TABLE VideoAccessibility(
	VideoAccessibilityID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	DisplayName NVARCHAR(30) NOT NULL,
	CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
);
GO

CREATE TABLE Video(
    VideoID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    ChannelID UNIQUEIDENTIFIER NOT NULL REFERENCES Channel(ChannelID),
    CommunityID UNIQUEIDENTIFIER NULL REFERENCES Community(CommunityID),
    VideoAccessibilityID INT NOT NULL REFERENCES VideoAccessibility(VideoAccessibilityID),
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(255) NULL,
    DurationSeconds INT NOT NULL,
    ThumbnailURL NVARCHAR(255) NOT NULL,
    VideoURL NVARCHAR(500) NOT NULL, --URL del archivo de video
    AgeRestriction BIT NOT NULL DEFAULT 0,
    IsPinned BIT NOT NULL DEFAULT 0,
    PublishedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    DeletedAt DATETIME2 NULL,
);
GO

-- ============================================================
--  Permisos y Roles
-- ============================================================

CREATE TABLE Permission(
    PermissionID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    Code NVARCHAR(100) NOT NULL UNIQUE,
    Module NVARCHAR(50) NOT NULL,
    Action NVARCHAR(50) NOT NULL,
    Name NVARCHAR(150) NOT NULL,
    Description NVARCHAR(500) NULL,
    DeletedAt DATETIME2 NULL,
);
GO

CREATE TABLE Roles(
	RoleID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
	Name NVARCHAR(100) NOT NULL UNIQUE,
	Description NVARCHAR(500) NULL,
	IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
	DeletedAt DATETIME2 NULL,
);
GO

CREATE TABLE RolePermission(
    RolePermissionID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    RoleID UNIQUEIDENTIFIER NOT NULL REFERENCES Roles(RoleID),
    PermissionID UNIQUEIDENTIFIER NOT NULL REFERENCES Permission(PermissionID),
    AssignedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_RolePermission UNIQUE (RoleID, PermissionID) -- evitar duplicados
);
GO

CREATE TABLE UserAccountRole(
    UserRoleID  UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    UserID UNIQUEIDENTIFIER NOT NULL REFERENCES UserAccount(UserID),
    RoleID UNIQUEIDENTIFIER NOT NULL REFERENCES Roles(RoleID),
    AssignedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    AssignedBy UNIQUEIDENTIFIER NULL, -- null = sistema
    CONSTRAINT UQ_UserAccountRole UNIQUE (UserID, RoleID) -- evita que el user no tenga el mismo rol
);
GO

CREATE TABLE Subscription(
    SubscriptionID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    UserID UNIQUEIDENTIFIER NOT NULL REFERENCES UserAccount(UserID),
    ChannelID UNIQUEIDENTIFIER NOT NULL REFERENCES Channel(ChannelID),
    VideoID UNIQUEIDENTIFIER NULL REFERENCES Video(VideoID),
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DeletedAt DATETIME2 NULL,
    CONSTRAINT UQ_Subscription UNIQUE (UserID, ChannelID) -- evitar que el user no se suscriba al mismo canal
);
GO

/* CREATE TABLE CommunitySubscription(
    CommunitySubscriptionID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    UserID UNIQUEIDENTIFIER NOT NULL REFERENCES UserAccount(UserID),
    CommunityID UNIQUEIDENTIFIER NOT NULL REFERENCES Community(CommunityID),
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DeletedAt DATETIME2 NULL,
    CONSTRAINT UQ_CommunitySubscription UNIQUE (UserID, CommunityID)
);
GO */

CREATE TABLE ViewHistory(
    ViewHistoryID  UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    UserID UNIQUEIDENTIFIER NOT NULL REFERENCES UserAccount(UserID),
    VideoID UNIQUEIDENTIFIER NOT NULL REFERENCES Video(VideoID),
    CompletionRate DECIMAL NOT NULL DEFAULT 0.0,
	WatchedSeconds INT NULL,-- reanudar el video donde lo dejo el user
    LastViewedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_ViewHistory UNIQUE (UserID, VideoID)
);
GO

CREATE TABLE Tag(
    TagID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    DisplayName NVARCHAR(30) NOT NULL UNIQUE,
);
GO

CREATE TABLE ReactionType(
    ReactionTypeID INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    DisplayName NVARCHAR(20) NOT NULL UNIQUE,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
);
GO

CREATE TABLE VideoReaction(
    VideoReactionID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    VideoID UNIQUEIDENTIFIER NOT NULL REFERENCES Video(VideoID),
    UserID UNIQUEIDENTIFIER NOT NULL REFERENCES UserAccount(UserID),
    ReactionTypeID INT NOT NULL REFERENCES ReactionType(ReactionTypeID),
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_VideoReaction UNIQUE (VideoID, UserID) -- solo puede tener una reaccion por video
);
GO

CREATE TABLE Comment(
	CommentID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
	VideoID UNIQUEIDENTIFIER NOT NULL REFERENCES Video(VideoID),
	UserID UNIQUEIDENTIFIER NOT NULL REFERENCES UserAccount(UserID),
	Content NVARCHAR(1000) NOT NULL,
	IsPinned BIT NOT NULL DEFAULT 0,
	ParentCommentID UNIQUEIDENTIFIER NULL REFERENCES Comment(CommentID),
	CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
	UpdatedAt DATETIME2 NULL,
	DeletedAt DATETIME2 NULL,
);
GO

-- para saber si la playlist fue creada por un user o channel
CREATE TABLE CreatorType(
    CreatorTypeID INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    DisplayName NVARCHAR(30) NOT NULL UNIQUE,
);
GO

CREATE TABLE Playlist(
    PlaylistID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    CreatorTypeID INT NOT NULL REFERENCES CreatorType(CreatorTypeID),
    UserID UNIQUEIDENTIFIER NOT NULL REFERENCES UserAccount(UserID),
    ChannelID UNIQUEIDENTIFIER NULL REFERENCES Channel(ChannelID),
    Title NVARCHAR(150) NOT NULL,
    Description NVARCHAR(255) NULL,
    IsPublic BIT NOT NULL DEFAULT 1, --publica o privada
    IsCollaborative BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    DeletedAt DATETIME2 NULL,
);
GO

CREATE TABLE PlaylistContributor(
    PlaylistID UNIQUEIDENTIFIER NOT NULL REFERENCES Playlist(PlaylistID),
    UserID UNIQUEIDENTIFIER NOT NULL REFERENCES UserAccount(UserID),
    AddedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_PlaylistContribuitor PRIMARY KEY (PlaylistID, UserID)
);
GO

CREATE TABLE VideoTag(
    VideoID UNIQUEIDENTIFIER NOT NULL REFERENCES Video(VideoID),
    TagID UNIQUEIDENTIFIER NOT NULL REFERENCES Tag(TagID),
    CONSTRAINT PK_VideoTag PRIMARY KEY (VideoID, TagID),
);
GO

CREATE TABLE PlaylistVideo(
    PlaylistID  UNIQUEIDENTIFIER NOT NULL REFERENCES Playlist(PlaylistID),
    VideoID UNIQUEIDENTIFIER NOT NULL REFERENCES Video(VideoID),
    AddedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_PlaylistVideo PRIMARY KEY (PlaylistID, VideoID),
);
GO

-- ============================================================
--  Preferencias del usuario
-- ============================================================
CREATE TABLE UserPreference(
    UserPreferenceID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    UserID UNIQUEIDENTIFIER NOT NULL UNIQUE REFERENCES UserAccount(UserID),
    ThemeName NVARCHAR(30) NOT NULL DEFAULT 'Dark',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE UserPreferenceTag(
    UserPreferenceTagID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    UserPreferenceID UNIQUEIDENTIFIER NOT NULL REFERENCES UserPreference(UserPreferenceID),
    TagID UNIQUEIDENTIFIER NOT NULL REFERENCES Tag(TagID),
    CONSTRAINT UQ_UserPreferenceTag UNIQUE(UserPreferenceID, TagID)
);
GO

CREATE TABLE EmailTemplates (
    EmailTemplateId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Subject VARCHAR(255) NOT NULL,
    Body NVARCHAR(2000) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1, -- poder desactivar sin eliminar
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
);
GO

-- ============================================================
--  Sistema de monedas
-- ============================================================
CREATE TABLE MembershipPlan(
    MembershipPlanID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    DisplayName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(255) NULL,
    MonthlyPrice DECIMAL(10,2) NOT NULL,
    CoinsReward INT NOT NULL DEFAULT 0,
    MaxCommunities INT NOT NULL DEFAULT 1,
    MaxVideosPerCommunity INT NOT NULL DEFAULT 10;
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    DeletedAt DATETIME2 NULL
);
GO

CREATE TABLE UserMembership(
    UserMembershipID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    UserID UNIQUEIDENTIFIER NOT NULL REFERENCES UserAccount(UserID),
    MembershipPlanID INT NOT NULL REFERENCES MembershipPlan(MembershipPlanID),
    StartDate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    EndDate DATETIME2 NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE UserWallet(
    UserWalletID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    UserID UNIQUEIDENTIFIER NOT NULL UNIQUE REFERENCES UserAccount(UserID),
    Balance INT NOT NULL DEFAULT 0,
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE WalletTransaction(
    WalletTransactionID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    UserWalletID UNIQUEIDENTIFIER NOT NULL REFERENCES UserWallet(UserWalletID),
    Amount INT NOT NULL,
    TransactionType NVARCHAR(30) NOT NULL,
    Description NVARCHAR(255) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- MONEDAS
CREATE TABLE CoinPackage(
    CoinPackageID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    DisplayName NVARCHAR(50) NOT NULL,
    CoinAmount INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL
);
GO

CREATE TABLE CoinPurchaseRequest(
    CoinPurchaseRequestID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    UserID UNIQUEIDENTIFIER NOT NULL REFERENCES UserAccount(UserID),
    CoinPackageID INT NOT NULL REFERENCES CoinPackage(CoinPackageID),
    BankReference NVARCHAR(100) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending'
        CHECK (Status IN ('Pending', 'Approved', 'Rejected')),
    RequestedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    ProcessedAt DATETIME2 NULL
);
GO

-- ============================================================
--  DML: Email Templates
-- ============================================================

INSERT INTO EmailTemplates (Name, Subject, Body) VALUES
('USER_REGISTER',
 'Bienvenido a YoutubeClone',
 'Tu cuenta fue creada. Tu contraseña es: <strong>{{password}}</strong>'),

('AUTH_LOGIN_SUCCESS',
 'Inicio de sesión exitoso',
 'Iniciaste sesión el <strong>{{datetime}}</strong>'),

('AUTH_LOGIN_FAILED',
 'Intento de inicio de sesión fallido',
 'Se intent  iniciar sesión en tu cuenta. Si no fuiste tú , contacta al administrador.'),

('AUTH_REGISTER_EMAIL_VERIFICATION',
'Verificación de correo - YoutubeClone',
'Hola, para continuar con su proceso de registro, necesita validar su correo electrónico, haciendo clic en el siguiente <a href="{{url}}">enlace</a>.'),

('AUTH_RECOVER_PASSWORD_OTP',
'Recuperación de contraseña - YoutubeClone',
'Hola, el siguiente código le permitirá completar el proceso de cambio de contraseña para su cuenta: <strong>{{otp}}</strong>'),

('AUTH_PASSWORD_CHANGED',
'Contraseña cambiada con éxito', 
'Su contraseña ha sido cambiada exitosamente.');
GO

-- ============================================================
--  DML: Roles del sistema
-- ============================================================

DECLARE @RoleSystem    UNIQUEIDENTIFIER = NEWID();
DECLARE @RoleAdmin     UNIQUEIDENTIFIER = NEWID();
DECLARE @RoleCreator   UNIQUEIDENTIFIER = NEWID();
DECLARE @RoleUser      UNIQUEIDENTIFIER = NEWID();

INSERT INTO Roles (RoleID, Name, Description) VALUES
(@RoleSystem,  'Sistema',               'Rol interno. Ejecuta procesos automatizados como env o de correos y asignación inicial de roles. No asignable manualmente.'),
(@RoleAdmin,   'Administrador',         'Modera contenido de la plataforma. Puede eliminar videos, suspender canales, verificar creadores y gestionar comentarios.'),
(@RoleCreator, 'Creador de Contenido',  'Puede subir y gestionar sus propios videos, administrar su canal y crear playlists.'),
(@RoleUser,    'Usuario',               'Puede ver videos, reaccionar, comentar, suscribirse a canales y gestionar su historial y playlists personales.');
GO

-- ============================================================
-- DML: Catálogo de permisos
-- ============================================================

INSERT INTO Permission (PermissionID, Code, Module, Action, Name, Description)
VALUES
    (NEWID(), 'CHANNELS/CREATE',           'CHANNELS',   'CREATE',  'Crear canal',              'Permite crear un canal'),
    (NEWID(), 'CHANNELS/UPDATE',           'CHANNELS',   'UPDATE',  'Actualizar canal',         'Permite actualizar un canal propio'),
    (NEWID(), 'CHANNELS/VERIFY',           'CHANNELS',   'VERIFY',  'Verificar canal',          'Permite verificar canales'),

    (NEWID(), 'VIDEOS/UPLOAD',             'VIDEOS',     'UPLOAD',  'Subir video',              'Permite subir videos'),
    (NEWID(), 'VIDEOS/UPDATE',             'VIDEOS',     'UPDATE',  'Editar video',             'Permite editar videos propios'),
    (NEWID(), 'VIDEOS/DELETE',             'VIDEOS',     'DELETE',  'Eliminar video',           'Permite eliminar videos'),
    (NEWID(), 'VIDEOS/MODERATE',           'VIDEOS',     'MODERATE','Moderar videos',           'Permite moderar videos de terceros'),

    (NEWID(), 'COMMENTS/CREATE',           'COMMENTS',   'CREATE',  'Crear comentario',         'Permite comentar videos'),
    (NEWID(), 'COMMENTS/DELETE',           'COMMENTS',   'DELETE',  'Eliminar comentario',      'Permite eliminar comentarios'),
    (NEWID(), 'COMMENTS/DELETE_OWN',       'COMMENTS',   'DELETE',  'Eliminar comentario propio','Permite eliminar comentarios propios'),
    (NEWID(), 'COMMENTS/MODERATE',         'COMMENTS',   'MODERATE','Moderar comentarios',      'Permite moderar comentarios'),

    (NEWID(), 'PLAYLISTS/CREATE',          'PLAYLISTS',  'CREATE',  'Crear playlist',           'Permite crear playlists'),
    (NEWID(), 'PLAYLISTS/UPDATE',          'PLAYLISTS',  'UPDATE',  'Editar playlist',          'Permite editar playlists'),
    (NEWID(), 'PLAYLISTS/DELETE',          'PLAYLISTS',  'DELETE',  'Eliminar playlist',        'Permite eliminar playlists'),

    (NEWID(), 'USERS/MANAGE',              'USERS',      'MANAGE',  'Gestionar usuarios',       'Permite administrar usuarios'),
    (NEWID(), 'ADMIN/ACCESS',              'ADMIN',      'ACCESS',  'Acceso panel admin',       'Permite acceder al panel administrativo');
GO

-- Administrador = todos los permisos
INSERT INTO RolePermission (RolePermissionID, RoleID, PermissionID)
SELECT NEWID(), r.RoleID, p.PermissionID
FROM Roles r
CROSS JOIN Permission p -- une todas las tablas
WHERE r.Name = 'Administrador';
GO

-- Creador de contenido
INSERT INTO RolePermission (RolePermissionID, RoleID, PermissionID)
SELECT NEWID(), r.RoleID, p.PermissionID
FROM Roles r
JOIN Permission p ON p.Code IN (
    'CHANNELS/CREATE',
    'CHANNELS/UPDATE',
    'VIDEOS/UPLOAD',
    'VIDEOS/UPDATE',
    'VIDEOS/DELETE',
    'COMMENTS/CREATE',
	'COMMENTS/DELETE_OWN',
    'PLAYLISTS/CREATE',
    'PLAYLISTS/UPDATE',
    'PLAYLISTS/DELETE'
)
WHERE r.Name = 'Creador de Contenido';
GO

-- Usuario normal
INSERT INTO RolePermission (RolePermissionID, RoleID, PermissionID)
SELECT NEWID(), r.RoleID, p.PermissionID
FROM Roles r
JOIN Permission p ON p.Code IN (
    'COMMENTS/CREATE',
    'COMMENTS/DELETE_OWN',
    'PLAYLISTS/CREATE',
    'PLAYLISTS/UPDATE',
    'PLAYLISTS/DELETE'
)
WHERE r.Name = 'Usuario';
GO

-- ============================================================
--  DML: Planes de membresía
-- ============================================================
INSERT INTO MembershipPlan (DisplayName, Description, MonthlyPrice, CoinsReward, MaxCommunities, MaxVideosPerCommunity)
VALUES
(
    'Free',
    'Permite crear hasta 1 comunidad con un máximo de 10 videos. No incluye monedas.',
    0.00, 0, 1, 10
),
(
    'Básico',
    'Permite crear hasta 3 comunidades con un máximo de 20 videos en cada una. Incluye 100 monedas instantaneamente.',
    4.99, 100, 3, 20
),
(
    'Premium',
    'Permite crear hasta 5 comunidades con un máximo de 25 videos en cada una. Incluye 200 monedas instantaneamente.',
    9.99, 200, 5, 25
),
(
    'Creator Pass',
    'Permite crear hasta 10 comunidades con un máximo de 30 videos en cada una. Incluye 400 monedas instantaneamente.',
    19.99, 400, 10, 30
);
GO

-- ============================================================
--  DML: Paquetes de monedas (CoinPackage)
-- ============================================================
-- Estos también estaban vacíos, los incluyo para completar el sistema:

INSERT INTO CoinPackage (DisplayName, CoinAmount, Price)
VALUES
    ('Bolsillo',    100,   0.99),
    ('Estándar',    500,   3.99),
    ('Popular',    1200,   7.99),
    ('Generoso',   2500,  14.99),
    ('Mega Pack',  6000,  29.99);
GO

-- ============================================================
--  DML: Tipos de reacción (ReactionType)
-- ============================================================

INSERT INTO ReactionType (DisplayName) VALUES
    ('Like'),
    ('Dislike');
GO

-- ============================================================
--  DML: Tipos de creador de playlist (CreatorType)
-- ============================================================

INSERT INTO CreatorType (DisplayName) VALUES
    ('Usuario'),
    ('Canal');
GO

-- ============================================================
--  DML: Accesibilidad de video (VideoAccessibility)
-- ============================================================

INSERT INTO VideoAccessibility (DisplayName) VALUES
    ('Público'),
    ('No listado'),
    ('Privado');
GO