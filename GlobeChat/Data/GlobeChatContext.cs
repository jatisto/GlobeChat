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
               .HasMany(u => u.Channels);
            modelBuilder.Entity<Channel>()
                .HasKey(c => c.Id);
            modelBuilder.Entity<Channel>()
                .HasMany(u => u.Users);
        }
        public GlobeChatContext(DbContextOptions<GlobeChatContext> options)
            : base(options)
        {
        }
        public DbSet<GlobeChat.Models.User> User { get; set; }
        public DbSet<GlobeChat.Models.DbLog> DbLog { get; set; }
        public DbSet<GlobeChat.Models.ActivationCode> ActivationCodes { get; set; }
        public DbSet<GlobeChat.Models.Channel> Channels { get; set; }


    }
}
