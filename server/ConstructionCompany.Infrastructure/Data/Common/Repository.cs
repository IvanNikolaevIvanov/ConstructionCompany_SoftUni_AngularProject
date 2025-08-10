using ConstructionCompany.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Linq;
using System.Threading.Tasks.Dataflow;

namespace ConstructionCompany.Infrastructure.Data.Common
{
    public class Repository : IRepository
    {
        private readonly ConstructionCompanyDbContext context;

        public Repository(ConstructionCompanyDbContext _context)
        {
                context = _context;
        }

        private DbSet<T> DbSet<T>() where T : class
        {
            return context.Set<T>();
        }

        public IQueryable<T> All<T>() where T : class
        {
            return DbSet<T>();
        }

        public IQueryable<T> AllReadOnly<T>() where T : class
        {
            return DbSet<T>()
                .AsNoTracking();
        }

        public async Task AddAsync<T>(T entity) where T : class
        {
            await DbSet<T>().AddAsync(entity);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await context.SaveChangesAsync();
        }

        public async Task<T?> GetByIdAsync<T>(object id) where T : class
        {
            return await DbSet<T>().FindAsync(id);
        }

        public async Task<IEnumerable<ApplicationFile>> GetFilesByApplicationId(int applicationId)
        {
            var listToReturn = await context.Set<ApplicationFile>()
                .Where(f => f.ApplicationId == applicationId)
                .ToListAsync();
            

            return listToReturn;
        }

        public async Task DeleteAsync<T>(object id) where T : class
        {
            T? entity = await GetByIdAsync<T>(id);

            if (entity != null)
            {
                DbSet<T>().Remove(entity);
            }
        }

        public async Task DeleteAsync<T>(T entity) where T : class
        {
             DbSet<T>().Remove(entity);
        }

        public async Task<IEnumerable<ApplicationUser>> GetSupervisorsAsync()
        {
            try
            {
                var supervisors = await (from user in context.Users
                                         join userRole in context.UserRoles
                                         on user.Id equals userRole.UserId
                                         join role in context.Roles
                                         on userRole.RoleId equals role.Id
                                         where role.Name == "Supervisor"
                                         select user)
                                     .Distinct()
                                     .ToListAsync();

                return supervisors;
            }
            catch (Exception)
            {

                throw;
            }
            
        }
    }
}
