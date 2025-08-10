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
            await CreateUserAsync(userManager, "agent1@demo.com", "Agent123!", "Agent", "John", "Doe");
            await CreateUserAsync(userManager, "agent2@demo.com", "Agent123!", "Agent", "Jane", "Smith");

            await CreateUserAsync(userManager, "supervisor1@demo.com", "Supervisor123!", "Supervisor", "Donald", "Trump");
            await CreateUserAsync(userManager, "supervisor2@demo.com", "Supervisor123!", "Supervisor", "Vladimir", "Putin");

        }

        private static async Task CreateUserAsync(UserManager<ApplicationUser> userManager, string email, string password, string role, string firstName, string lastName)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                var newUser = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,
                    FirstName = firstName,
                    LastName = lastName
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
