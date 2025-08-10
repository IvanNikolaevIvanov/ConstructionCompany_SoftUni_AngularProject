using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ConstructionCompany.Infrastructure.Data;

public class ConstructionCompanyDbContext : IdentityDbContext<ApplicationUser>
{
    public ConstructionCompanyDbContext(DbContextOptions<ConstructionCompanyDbContext> options)
        : base(options) 
    {

    }

    public DbSet<ProjectApplication> Applications { get; set; } = null!;
    public DbSet<SupervisorFeedback> Feedbacks { get; set; } = null!;
    public DbSet<ApplicationFile> Files { get; set; } = null!;
    public DbSet<ApplicationUser> ApplicationUsers { get; set; } = null!;



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<SupervisorFeedback>()
            .HasOne(f => f.Author)
            .WithMany()
            .HasForeignKey(f => f.AuthorId)
            .OnDelete(DeleteBehavior.Restrict); 
    }

}
