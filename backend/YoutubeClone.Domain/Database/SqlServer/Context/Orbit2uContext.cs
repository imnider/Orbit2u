using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Domain.Database.SqlServer.Context;

public partial class Orbit2uContext : DbContext
{
    public Orbit2uContext(DbContextOptions<Orbit2uContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Channel> Channels { get; set; }

    public virtual DbSet<CoinPackage> CoinPackages { get; set; }

    public virtual DbSet<CoinPurchaseRequest> CoinPurchaseRequests { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<Community> Communities { get; set; }

    public virtual DbSet<CommunityMember> CommunityMembers { get; set; }

    public virtual DbSet<CreatorType> CreatorTypes { get; set; }

    public virtual DbSet<EmailTemplate> EmailTemplates { get; set; }

    public virtual DbSet<LogEvent> LogEvents { get; set; }

    public virtual DbSet<MembershipPlan> MembershipPlans { get; set; }

    public virtual DbSet<Permission> Permissions { get; set; }

    public virtual DbSet<Playlist> Playlists { get; set; }

    public virtual DbSet<PlaylistContributor> PlaylistContributors { get; set; }

    public virtual DbSet<PlaylistVideo> PlaylistVideos { get; set; }

    public virtual DbSet<ReactionType> ReactionTypes { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RolePermission> RolePermissions { get; set; }

    public virtual DbSet<Subscription> Subscriptions { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    public virtual DbSet<UserAccount> UserAccounts { get; set; }

    public virtual DbSet<UserAccountRole> UserAccountRoles { get; set; }

    public virtual DbSet<UserMembership> UserMemberships { get; set; }

    public virtual DbSet<UserPreference> UserPreferences { get; set; }

    public virtual DbSet<UserPreferenceTag> UserPreferenceTags { get; set; }

    public virtual DbSet<UserWallet> UserWallets { get; set; }

    public virtual DbSet<Video> Videos { get; set; }

    public virtual DbSet<VideoAccessibility> VideoAccessibilities { get; set; }

    public virtual DbSet<VideoReaction> VideoReactions { get; set; }

    public virtual DbSet<ViewHistory> ViewHistories { get; set; }

    public virtual DbSet<WalletTransaction> WalletTransactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Channel>(entity =>
        {
            entity.HasKey(e => e.ChannelId).HasName("PK__Channel__38C3E8F49D2B5671");

            entity.ToTable("Channel");

            entity.HasIndex(e => e.Handle, "UQ__Channel__FE5BB31A71DE0686").IsUnique();

            entity.Property(e => e.ChannelId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ChannelID");
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(255)
                .HasColumnName("AvatarURL");
            entity.Property(e => e.BannerUrl)
                .HasMaxLength(255)
                .HasColumnName("BannerURL");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.DisplayName).HasMaxLength(50);
            entity.Property(e => e.Handle).HasMaxLength(20);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Channels)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Channel__UserID__5165187F");
        });

        modelBuilder.Entity<CoinPackage>(entity =>
        {
            entity.HasKey(e => e.CoinPackageId).HasName("PK__CoinPack__9CB4449A1A386C1F");

            entity.ToTable("CoinPackage");

            entity.Property(e => e.CoinPackageId).HasColumnName("CoinPackageID");
            entity.Property(e => e.DisplayName).HasMaxLength(50);
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
        });

        modelBuilder.Entity<CoinPurchaseRequest>(entity =>
        {
            entity.HasKey(e => e.CoinPurchaseRequestId).HasName("PK__CoinPurc__457AD13523DB1051");

            entity.ToTable("CoinPurchaseRequest");

            entity.Property(e => e.CoinPurchaseRequestId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("CoinPurchaseRequestID");
            entity.Property(e => e.BankReference).HasMaxLength(100);
            entity.Property(e => e.CoinPackageId).HasColumnName("CoinPackageID");
            entity.Property(e => e.RequestedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Pending");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.CoinPackage).WithMany(p => p.CoinPurchaseRequests)
                .HasForeignKey(d => d.CoinPackageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CoinPurch__CoinP__7755B73D");

            entity.HasOne(d => d.User).WithMany(p => p.CoinPurchaseRequests)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CoinPurch__UserI__76619304");
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PK__Comment__C3B4DFAA2096F434");

            entity.ToTable("Comment");

            entity.Property(e => e.CommentId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("CommentID");
            entity.Property(e => e.Content).HasMaxLength(1000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.ParentCommentId).HasColumnName("ParentCommentID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.VideoId).HasColumnName("VideoID");

            entity.HasOne(d => d.ParentComment).WithMany(p => p.InverseParentComment)
                .HasForeignKey(d => d.ParentCommentId)
                .HasConstraintName("FK__Comment__ParentC__2BFE89A6");

            entity.HasOne(d => d.User).WithMany(p => p.Comments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Comment__UserID__2A164134");

            entity.HasOne(d => d.Video).WithMany(p => p.Comments)
                .HasForeignKey(d => d.VideoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Comment__VideoID__29221CFB");
        });

        modelBuilder.Entity<Community>(entity =>
        {
            entity.HasKey(e => e.CommunityId).HasName("PK__Communit__CCAA5B0970886585");

            entity.ToTable("Community");

            entity.HasIndex(e => e.Name, "UQ__Communit__737584F6CFB008CB").IsUnique();

            entity.Property(e => e.CommunityId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("CommunityID");
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(255)
                .HasColumnName("AvatarURL");
            entity.Property(e => e.BannerUrl)
                .HasMaxLength(255)
                .HasColumnName("BannerURL");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.OwnerUserId).HasColumnName("OwnerUserID");

            entity.HasOne(d => d.OwnerUser).WithMany(p => p.Communities)
                .HasForeignKey(d => d.OwnerUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Community__Owner__5812160E");
        });

        modelBuilder.Entity<CommunityMember>(entity =>
        {
            entity.HasKey(e => e.CommunityMemberId).HasName("PK__Communit__F315FA36789D6C58");

            entity.ToTable("CommunityMember");

            entity.HasIndex(e => new { e.CommunityId, e.UserId }, "UQ_CommunityMember").IsUnique();

            entity.Property(e => e.CommunityMemberId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("CommunityMemberID");
            entity.Property(e => e.CommunityId).HasColumnName("CommunityID");
            entity.Property(e => e.JoinedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Community).WithMany(p => p.CommunityMembers)
                .HasForeignKey(d => d.CommunityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Community__Commu__5EBF139D");

            entity.HasOne(d => d.User).WithMany(p => p.CommunityMembers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Community__UserI__5FB337D6");
        });

        modelBuilder.Entity<CreatorType>(entity =>
        {
            entity.HasKey(e => e.CreatorTypeId).HasName("PK__CreatorT__2D56E80A140EA5CA");

            entity.ToTable("CreatorType");

            entity.HasIndex(e => e.DisplayName, "UQ__CreatorT__4E3E687DF2AA5FC6").IsUnique();

            entity.Property(e => e.CreatorTypeId).HasColumnName("CreatorTypeID");
            entity.Property(e => e.DisplayName).HasMaxLength(30);
        });

        modelBuilder.Entity<EmailTemplate>(entity =>
        {
            entity.HasKey(e => e.EmailTemplateId).HasName("PK__EmailTem__BC0A387520A43B04");

            entity.HasIndex(e => e.Name, "UQ__EmailTem__737584F671BA67C6").IsUnique();

            entity.Property(e => e.Body).HasMaxLength(2000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Subject)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        modelBuilder.Entity<LogEvent>(entity =>
        {
            entity.Property(e => e.Level).HasMaxLength(16);
            entity.Property(e => e.TimeStamp).HasColumnType("datetime");
        });

        modelBuilder.Entity<MembershipPlan>(entity =>
        {
            entity.HasKey(e => e.MembershipPlanId).HasName("PK__Membersh__8E444BD6AB0B0AC0");

            entity.ToTable("MembershipPlan");

            entity.Property(e => e.MembershipPlanId).HasColumnName("MembershipPlanID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.DisplayName).HasMaxLength(50);
            entity.Property(e => e.MaxCommunities).HasDefaultValue(1);
            entity.Property(e => e.MaxVideosPerCommunity).HasDefaultValue(10);
            entity.Property(e => e.MonthlyPrice).HasColumnType("decimal(10, 2)");
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.HasKey(e => e.PermissionId).HasName("PK__Permissi__EFA6FB0FCC60AF1B");

            entity.ToTable("Permission");

            entity.HasIndex(e => e.Code, "UQ__Permissi__A25C5AA797BA0592").IsUnique();

            entity.Property(e => e.PermissionId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("PermissionID");
            entity.Property(e => e.Action).HasMaxLength(50);
            entity.Property(e => e.Code).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Module).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<Playlist>(entity =>
        {
            entity.HasKey(e => e.PlaylistId).HasName("PK__Playlist__B3016780795A4C53");

            entity.ToTable("Playlist");

            entity.Property(e => e.PlaylistId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("PlaylistID");
            entity.Property(e => e.ChannelId).HasColumnName("ChannelID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.CreatorTypeId).HasColumnName("CreatorTypeID");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.IsPublic).HasDefaultValue(true);
            entity.Property(e => e.Title).HasMaxLength(150);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Channel).WithMany(p => p.Playlists)
                .HasForeignKey(d => d.ChannelId)
                .HasConstraintName("FK__Playlist__Channe__3587F3E0");

            entity.HasOne(d => d.CreatorType).WithMany(p => p.Playlists)
                .HasForeignKey(d => d.CreatorTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Playlist__Creato__339FAB6E");

            entity.HasOne(d => d.User).WithMany(p => p.Playlists)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Playlist__UserID__3493CFA7");
        });

        modelBuilder.Entity<PlaylistContributor>(entity =>
        {
            entity.HasKey(e => new { e.PlaylistId, e.UserId });

            entity.ToTable("PlaylistContributor");

            entity.Property(e => e.PlaylistId).HasColumnName("PlaylistID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.AddedAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Playlist).WithMany(p => p.PlaylistContributors)
                .HasForeignKey(d => d.PlaylistId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PlaylistC__Playl__3B40CD36");

            entity.HasOne(d => d.User).WithMany(p => p.PlaylistContributors)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PlaylistC__UserI__3C34F16F");
        });

        modelBuilder.Entity<PlaylistVideo>(entity =>
        {
            entity.HasKey(e => new { e.PlaylistId, e.VideoId });

            entity.ToTable("PlaylistVideo");

            entity.Property(e => e.PlaylistId).HasColumnName("PlaylistID");
            entity.Property(e => e.VideoId).HasColumnName("VideoID");
            entity.Property(e => e.AddedAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Playlist).WithMany(p => p.PlaylistVideos)
                .HasForeignKey(d => d.PlaylistId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PlaylistV__Playl__43D61337");

            entity.HasOne(d => d.Video).WithMany(p => p.PlaylistVideos)
                .HasForeignKey(d => d.VideoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PlaylistV__Video__44CA3770");
        });

        modelBuilder.Entity<ReactionType>(entity =>
        {
            entity.HasKey(e => e.ReactionTypeId).HasName("PK__Reaction__01E625C0C22A2AD7");

            entity.ToTable("ReactionType");

            entity.HasIndex(e => e.DisplayName, "UQ__Reaction__4E3E687D4740B481").IsUnique();

            entity.Property(e => e.ReactionTypeId).HasColumnName("ReactionTypeID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.DisplayName).HasMaxLength(20);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE3AE4AEFB28");

            entity.HasIndex(e => e.Name, "UQ__Roles__737584F61E4DA2DF").IsUnique();

            entity.Property(e => e.RoleId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("RoleID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysutcdatetime())");
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => e.RolePermissionId).HasName("PK__RolePerm__120F469AF7850E02");

            entity.ToTable("RolePermission");

            entity.HasIndex(e => new { e.RoleId, e.PermissionId }, "UQ_RolePermission").IsUnique();

            entity.Property(e => e.RolePermissionId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("RolePermissionID");
            entity.Property(e => e.AssignedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.PermissionId).HasColumnName("PermissionID");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");

            entity.HasOne(d => d.Permission).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.PermissionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RolePermi__Permi__7E37BEF6");

            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RolePermi__RoleI__7D439ABD");
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.SubscriptionId).HasName("PK__Subscrip__9A2B24BDB1C4DAA7");

            entity.ToTable("Subscription");

            entity.HasIndex(e => new { e.UserId, e.ChannelId }, "UQ_Subscription").IsUnique();

            entity.Property(e => e.SubscriptionId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("SubscriptionID");
            entity.Property(e => e.ChannelId).HasColumnName("ChannelID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.VideoId).HasColumnName("VideoID");

            entity.HasOne(d => d.Channel).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.ChannelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Subscript__Chann__0B91BA14");

            entity.HasOne(d => d.User).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Subscript__UserI__0A9D95DB");

            entity.HasOne(d => d.Video).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.VideoId)
                .HasConstraintName("FK__Subscript__Video__0C85DE4D");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.TagId).HasName("PK__Tag__657CFA4CC53660A7");

            entity.ToTable("Tag");

            entity.HasIndex(e => e.DisplayName, "UQ__Tag__4E3E687D29F609B2").IsUnique();

            entity.Property(e => e.TagId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("TagID");
            entity.Property(e => e.DisplayName).HasMaxLength(30);
        });

        modelBuilder.Entity<UserAccount>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__UserAcco__1788CCAC8B96CAA5");

            entity.ToTable("UserAccount");

            entity.HasIndex(e => e.Email, "UQ__UserAcco__A9D105341931A92C").IsUnique();

            entity.HasIndex(e => e.UserName, "UQ__UserAcco__C9F28456383BCB86").IsUnique();

            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.DisplayName).HasMaxLength(50);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Location).HasMaxLength(30);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.UserName).HasMaxLength(20);
        });

        modelBuilder.Entity<UserAccountRole>(entity =>
        {
            entity.HasKey(e => e.UserRoleId).HasName("PK__UserAcco__3D978A55FD869F8B");

            entity.ToTable("UserAccountRole");

            entity.HasIndex(e => new { e.UserId, e.RoleId }, "UQ_UserAccountRole").IsUnique();

            entity.Property(e => e.UserRoleId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserRoleID");
            entity.Property(e => e.AssignedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Role).WithMany(p => p.UserAccountRoles)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserAccou__RoleI__04E4BC85");

            entity.HasOne(d => d.User).WithMany(p => p.UserAccountRoles)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserAccou__UserI__03F0984C");
        });

        modelBuilder.Entity<UserMembership>(entity =>
        {
            entity.HasKey(e => e.UserMembershipId).HasName("PK__UserMemb__5A4E730AB2308E4C");

            entity.ToTable("UserMembership");

            entity.Property(e => e.UserMembershipId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserMembershipID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.MembershipPlanId).HasColumnName("MembershipPlanID");
            entity.Property(e => e.StartDate).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.MembershipPlan).WithMany(p => p.UserMemberships)
                .HasForeignKey(d => d.MembershipPlanId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserMembe__Membe__625A9A57");

            entity.HasOne(d => d.User).WithMany(p => p.UserMemberships)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserMembe__UserI__6166761E");
        });

        modelBuilder.Entity<UserPreference>(entity =>
        {
            entity.HasKey(e => e.UserPreferenceId).HasName("PK__UserPref__25771E38B325576F");

            entity.ToTable("UserPreference");

            entity.HasIndex(e => e.UserId, "UQ__UserPref__1788CCAD2ED6E936").IsUnique();

            entity.Property(e => e.UserPreferenceId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserPreferenceID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.ThemeName)
                .HasMaxLength(30)
                .HasDefaultValue("Dark");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithOne(p => p.UserPreference)
                .HasForeignKey<UserPreference>(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserPrefe__UserI__4A8310C6");
        });

        modelBuilder.Entity<UserPreferenceTag>(entity =>
        {
            entity.HasKey(e => e.UserPreferenceTagId).HasName("PK__UserPref__A530DAA30C6010F1");

            entity.ToTable("UserPreferenceTag");

            entity.HasIndex(e => new { e.UserPreferenceId, e.TagId }, "UQ_UserPreferenceTag").IsUnique();

            entity.Property(e => e.UserPreferenceTagId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserPreferenceTagID");
            entity.Property(e => e.TagId).HasColumnName("TagID");
            entity.Property(e => e.UserPreferenceId).HasColumnName("UserPreferenceID");

            entity.HasOne(d => d.Tag).WithMany(p => p.UserPreferenceTags)
                .HasForeignKey(d => d.TagId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserPrefe__TagID__531856C7");

            entity.HasOne(d => d.UserPreference).WithMany(p => p.UserPreferenceTags)
                .HasForeignKey(d => d.UserPreferenceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserPrefe__UserP__5224328E");
        });

        modelBuilder.Entity<UserWallet>(entity =>
        {
            entity.HasKey(e => e.UserWalletId).HasName("PK__UserWall__439F38AF6574C768");

            entity.ToTable("UserWallet");

            entity.HasIndex(e => e.UserId, "UQ__UserWall__1788CCAD50EC0E27").IsUnique();

            entity.Property(e => e.UserWalletId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UserWalletID");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithOne(p => p.UserWallet)
                .HasForeignKey<UserWallet>(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserWalle__UserI__69FBBC1F");
        });

        modelBuilder.Entity<Video>(entity =>
        {
            entity.HasKey(e => e.VideoId).HasName("PK__Video__BAE5124A7AA0B7BC");

            entity.ToTable("Video");

            entity.Property(e => e.VideoId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("VideoID");
            entity.Property(e => e.ChannelId).HasColumnName("ChannelID");
            entity.Property(e => e.CommunityId).HasColumnName("CommunityID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.PublishedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.ThumbnailUrl)
                .HasMaxLength(255)
                .HasColumnName("ThumbnailURL");
            entity.Property(e => e.Title).HasMaxLength(255);
            entity.Property(e => e.VideoAccessibilityId).HasColumnName("VideoAccessibilityID");
            entity.Property(e => e.VideoUrl)
                .HasMaxLength(500)
                .HasColumnName("VideoURL");

            entity.HasOne(d => d.Channel).WithMany(p => p.Videos)
                .HasForeignKey(d => d.ChannelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Video__ChannelID__68487DD7");

            entity.HasOne(d => d.Community).WithMany(p => p.Videos)
                .HasForeignKey(d => d.CommunityId)
                .HasConstraintName("FK__Video__Community__693CA210");

            entity.HasOne(d => d.VideoAccessibility).WithMany(p => p.Videos)
                .HasForeignKey(d => d.VideoAccessibilityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Video__VideoAcce__6A30C649");

            entity.HasMany(d => d.Tags).WithMany(p => p.Videos)
                .UsingEntity<Dictionary<string, object>>(
                    "VideoTag",
                    r => r.HasOne<Tag>().WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__VideoTag__TagID__40F9A68C"),
                    l => l.HasOne<Video>().WithMany()
                        .HasForeignKey("VideoId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__VideoTag__VideoI__40058253"),
                    j =>
                    {
                        j.HasKey("VideoId", "TagId");
                        j.ToTable("VideoTag");
                        j.IndexerProperty<Guid>("VideoId").HasColumnName("VideoID");
                        j.IndexerProperty<Guid>("TagId").HasColumnName("TagID");
                    });
        });

        modelBuilder.Entity<VideoAccessibility>(entity =>
        {
            entity.HasKey(e => e.VideoAccessibilityId).HasName("PK__VideoAcc__2597095355A97AE6");

            entity.ToTable("VideoAccessibility");

            entity.Property(e => e.VideoAccessibilityId).HasColumnName("VideoAccessibilityID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.DisplayName).HasMaxLength(30);
        });

        modelBuilder.Entity<VideoReaction>(entity =>
        {
            entity.HasKey(e => e.VideoReactionId).HasName("PK__VideoRea__BB33D46951A45E50");

            entity.ToTable("VideoReaction");

            entity.HasIndex(e => new { e.VideoId, e.UserId }, "UQ_VideoReaction").IsUnique();

            entity.Property(e => e.VideoReactionId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("VideoReactionID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.ReactionTypeId).HasColumnName("ReactionTypeID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.VideoId).HasColumnName("VideoID");

            entity.HasOne(d => d.ReactionType).WithMany(p => p.VideoReactions)
                .HasForeignKey(d => d.ReactionTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VideoReac__React__245D67DE");

            entity.HasOne(d => d.User).WithMany(p => p.VideoReactions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VideoReac__UserI__236943A5");

            entity.HasOne(d => d.Video).WithMany(p => p.VideoReactions)
                .HasForeignKey(d => d.VideoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VideoReac__Video__22751F6C");
        });

        modelBuilder.Entity<ViewHistory>(entity =>
        {
            entity.HasKey(e => e.ViewHistoryId).HasName("PK__ViewHist__55D4BB13484D60E7");

            entity.ToTable("ViewHistory");

            entity.HasIndex(e => new { e.UserId, e.VideoId }, "UQ_ViewHistory").IsUnique();

            entity.Property(e => e.ViewHistoryId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ViewHistoryID");
            entity.Property(e => e.CompletionRate).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.LastViewedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.VideoId).HasColumnName("VideoID");

            entity.HasOne(d => d.User).WithMany(p => p.ViewHistories)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ViewHisto__UserI__123EB7A3");

            entity.HasOne(d => d.Video).WithMany(p => p.ViewHistories)
                .HasForeignKey(d => d.VideoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ViewHisto__Video__1332DBDC");
        });

        modelBuilder.Entity<WalletTransaction>(entity =>
        {
            entity.HasKey(e => e.WalletTransactionId).HasName("PK__WalletTr__7184AECF676C2535");

            entity.ToTable("WalletTransaction");

            entity.Property(e => e.WalletTransactionId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("WalletTransactionID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.TransactionType).HasMaxLength(30);
            entity.Property(e => e.UserWalletId).HasColumnName("UserWalletID");

            entity.HasOne(d => d.UserWallet).WithMany(p => p.WalletTransactions)
                .HasForeignKey(d => d.UserWalletId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__WalletTra__UserW__6FB49575");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
