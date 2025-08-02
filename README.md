# Bricks & Steel – Construction Project Management SPA

A full-stack Single Page Application (SPA) built with **Angular (front-end)** and **ASP.NET Core (.NET 8) + Entity Framework + MS SQL Server** (back-end), featuring JWT authentication, Identity-based user registration, roles (Agent & Supervisor), project application submission and review flows.<br>

---

## 🏗️ Features

- **Authentication with ASP.NET Core Identity**, including JWT generation  
- **Agent role**: Create, track, and manage construction project applications  
- **Supervisor role**: Review, comment, approve, or return applications  
- Users get a token and role upon login or registration (no email confirmation required)

---

🚀 Step‑by‑Step Instructions to run the application using VS Code

1. Backend: ASP.NET Core API (ConstructionCompanyAPI)
Open a terminal (e.g. in VS Code):
cd path\to\server\ConstructionCompanyAPI
dotnet restore                        # Restore NuGet packages
dotnet ef database update            # Apply migrations, seed roles/users ❗️
dotnet run                           # Start backend on http://localhost:5000 or another port
Use dotnet ef migrations add InitialCreate if no migrations exist, then dotnet ef database update.<br>
<br>
✍️ EF Core stores the migration history in the database<br>
dotnet run builds and starts your app immediately (Kestrel server)<br>
`<br>`
2. Frontend: Angular SPA (ConstructionCompany.Web)`<br>`
In a second terminal:`<br>`
cd path\to\client\ConstructionCompany.Web`<br>`
npm install                          # Install dependencies
ng serve                             # Launch front end at http://localhost:4200`<br>`
ng serve serves the Angular app locally and automatically rebuilds on code changes`<br>`

| Terminal # | Context     | Command(s)                                    | Purpose        |
| ---------- | ----------- | --------------------------------------------- | -------------- |
| **1**      | Server/API  | `cd …\ConstructionCompanyAPI`<br>`dotnet ...` | Run backend    |
| **2**      | Client/SPA | `cd …\ConstructionCompany.Web`<br>`ng serve`  | Serve frontend |


## 🧾 Folder Structure

/ConstructionCompany.API ← Backend (ASP.NET Core, EF Core migrations, Identity)
/ConstructionCompany.Core ← Domain models, DTOs, Services layer (includes business logic)
/ConstructionCompany.Infrastructure ← Entity models, DbContext, repositories

/client ← Angular application
/src
/app
/features ← Feature components (home, login, dashboard, etc.)
/shared ← Shared components, models, services, guard, interceptor
/environments ← Contains environment.ts and environment.development.ts


## ⚙️ Prerequisites

| Component | Version |
|-----------|---------|
| [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download) | latest |
| SQL Server Express (or equivalent access to MS SQL) | +2019 |
| Node.js LTS (≥ 18) & npm | `node -v` & `npm -v` |
| Angular CLI | install with `npm install -g @angular/cli` :contentReference[oaicite:1]{index=1}

---

## 🔧 Setup Instructions

### 1. Configure Backend (`ConstructionCompany.API`)

1. Update **`appsettings.json`**:
   ```jsonc
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BricksSteelDB;Trusted_Connection=True;"
   },
   "Jwt": {
     "Key": "YourSecureSymmetricKeyAtLeast32Chars",
     "Issuer": "BricksSteel",
     "Audience": "BricksSteel"
   }
⚠️ Replace JWT Key with your own secret (≥ 32 characters).

Apply migrations and seed roles/users:

cd ConstructionCompany.API
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
At startup, the DbSeeder seeds two Agents and two Supervisors, plus the roles "Agent" and "Supervisor".

2. Configure Frontend (/client)
Navigate to client folder and install dependencies:

cd ../client
npm install
Open /src/environments/environment.ts (and .development.ts) and ensure it includes:

export const environment = {
  production: false,
  apiUrl: 'https://localhost:7124/api'
};
Angular CLI automatically replaces environment.ts depending on build mode. 
Microsoft Learn

Run the app:

ng serve --configuration=development --open
By default, it launches on http://localhost:4200/. API calls are proxied to the backend defined in environment.apiUrl.

▶️ Running the Solution
To launch both backend & frontend simultaneously:

From BricksSteelSolutionRoot:

start cmd /k "cd ConstructionCompany.API & dotnet run"
in a separate terminal:

cd client && ng serve --configuration=development
You should see the public landing page. Click Login/Register, register an account (default role = Agent), and perform login flows.

🔐 Sample Credentials
Agents seeded:

agent1@bricksandsteel.com / Pass123!

agent2@bricksandsteel.com / Pass123!

Supervisors seeded:

supervisor1@bricksandsteel.com / Pass123!

supervisor2@bricksandsteel.com / Pass123!

🚪 Access URLs
Role	After Login Redirect
Agent	/agent/dashboard
Supervisor	/supervisor/dashboard

Unauthorized access to any agent/** or supervisor/** route will redirect to login and then back to the original path post-authentication.

🎯 Notes on Authentication Flow
Registration triggers immediate login, returning a JWT plus assigned role.

Login endpoint at /api/auth/login verifies credentials, retrieves identity roles, constructs JWT with claims including ClaimTypes.Role.

Authentication guard checks token presence + validity, decodes role from it, and sets navigation logic.

HTTP interceptor automatically adds Authorization: Bearer <token> header.

All of this aligns with the recommended SPA-auth patterns combined with ASP.NET Core Identity and JWT. 

📌 Common Issues & Troubleshooting
JWT Key too short or invalid: You’ll get IDX10720: key size must be greater. Always use a 256-bit (32-character+) secret.

CORS errors on login POST: Make sure the backend in Program.cs includes:

builder.Services.AddCors(opts => opts.AddPolicy("AllowAll", p =>
     p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
app.UseCors("AllowAll");
Angular Cannot Redeclare FormControl or ngServe outside workspace issues: Ensure you’re running CLI commands from /client, not higher up.

Role-based guard not working: Clear local storage and re-login to reset your user role in the @Injectable AuthService.

📚 Useful References
Angular environment configuration and CLI usage 
angular.dev

Securing API endpoints using ASP.NET Core Identity with JWT for SPAs 
Microsoft Learn

📄 License
This work is provided for educational use. All code is under the MIT License. Feel free to reuse and adapt as permitted.

