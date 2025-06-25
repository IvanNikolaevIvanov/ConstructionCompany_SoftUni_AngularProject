using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ConstructionCompany.Infrastructure.Data;

public class ConstructionCompanyDbContext : IdentityDbContext<ApplicationUser>
{
    public ConstructionCompanyDbContext(DbContextOptions<ConstructionCompanyDbContext> options)
        : base(options) 
    {

    }

    public DbSet<ProjectApplication> Applications { get; set; }
}
