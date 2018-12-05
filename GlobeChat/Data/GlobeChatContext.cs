using Microsoft.EntityFrameworkCore;
namespace GlobeChat.Models
{
    public class GlobeChatContext : DbContext
    {
        public GlobeChatContext()
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasKey(u => u.Id);
            modelBuilder.Entity<User>()
               .HasOne(u => u.Channel);
            modelBuilder.Entity<Channel>()
                .HasKey(c => c.Id);
            modelBuilder.Entity<Channel>()
                .HasMany(u => u.Users);

            modelBuilder.Entity<Connection>()
                .HasKey(c => c.connectionId);
            modelBuilder.Entity<Connection>()
                .HasOne(u => u.User);

            modelBuilder.Entity<User>()
               .HasKey(c => c.Id);
            modelBuilder.Entity<User>()
                .HasOne(u => u.ConnectionId);
        }
        public GlobeChatContext(DbContextOptions<GlobeChatContext> options)
            : base(options)
        {
        }
        public DbSet<GlobeChat.Models.User> User { get; set; }
        public DbSet<GlobeChat.Models.DbLog> DbLog { get; set; }
        public DbSet<GlobeChat.Models.ActivationCode> ActivationCodes { get; set; }
        public DbSet<GlobeChat.Models.Channel> Channels { get; set; }
        public DbSet<GlobeChat.Models.Connection> Connections { get; set; }


    }
}
