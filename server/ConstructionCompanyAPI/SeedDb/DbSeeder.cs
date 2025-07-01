using Microsoft.AspNetCore.Identity;

namespace ConstructionCompany.API.SeedDb
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            string[] roles = new[] { "Agent", "Supervisor" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Seed users
            await CreateUserAsync(userManager, "agent1@demo.com", "Agent123!", "Agent");
            await CreateUserAsync(userManager, "agent2@demo.com", "Agent123!", "Agent");

            await CreateUserAsync(userManager, "supervisor1@demo.com", "Supervisor123!", "Supervisor");
            await CreateUserAsync(userManager, "supervisor2@demo.com", "Supervisor123!", "Supervisor");

        }

        private static async Task CreateUserAsync(UserManager<ApplicationUser> userManager, string email, string password, string role)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                var newUser = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(newUser, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newUser, role);
                }
            }
        }
    }
}
