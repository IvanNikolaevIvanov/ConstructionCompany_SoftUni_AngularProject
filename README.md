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
<br>
2. Frontend: Angular SPA (ConstructionCompany.Web)<br>
In a second terminal:<br>
cd path\to\client\ConstructionCompany.Web<br>
npm install                          # Install dependencies<br>
npm start                            # Launch front end at http://localhost:4200<br>
npm start serves the Angular app locally using "ng serve --proxy-config proxy.conf.json" and automatically rebuilds on code changes<br>

| Terminal # | Context     | Command(s)                                    | Purpose        |
| ---------- | ----------- | --------------------------------------------- | -------------- |
| **1**      | Server/API  | `cd …\ConstructionCompanyAPI`<br>`dotnet ...` | Run backend    |
| **2**      | Client/SPA | `cd …\ConstructionCompany.Web`<br>`npm start`  | Serve frontend |


## 🧾 Folder Structure<br>
<br>
/ConstructionCompany.API ← Backend (ASP.NET Core, EF Core migrations, Identity)<br>
/ConstructionCompany.Core ← Domain models, DTOs, Services layer (includes business logic)<br>
/ConstructionCompany.Infrastructure ← Entity models, DbContext, repositories<br>
<br>
/client ← Angular application<br>
/src<br>
/app<br>
/features ← Feature components (home, login, dashboard, etc.)<br>
/shared ← Shared components, models, services, guard, interceptor<br>
/environments ← Contains environment.ts and environment.development.ts<br>
<br>

## ⚙️ Prerequisites<br>
<br>
| Component | Version |
|-----------|---------|
| [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download) | latest |
| SQL Server Express (or equivalent access to MS SQL) | +2019 |
| Node.js LTS (≥ 18) & npm | `node -v` & `npm -v` |
| Angular CLI | install with `npm install -g @angular/cli` :contentReference[oaicite:1]{index=1}<br>
<br>
---<br>
<br>
## 🔧 Setup Instructions<br>
<br>
### 1. Configure Backend (`ConstructionCompany.API`)<br>
<br>
1. Update **`appsettings.json`**:
   ```jsonc
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BricksSteelDB;Trusted_Connection=True;"
   },
   "Jwt": {
     "Key": "YourSecureSymmetricKeyAtLeast32Chars",
     "Issuer": "BricksSteel",
     "Audience": "BricksSteel"
   }<br>
⚠️ Replace JWT Key with your own secret (≥ 32 characters).<br>
<br>
Apply migrations and seed roles/users:<br>
<br>
cd ConstructionCompany.API<br>
dotnet restore<br>
dotnet ef migrations add InitialCreate<br>
dotnet ef database update<br>
dotnet run<br>
At startup, the DbSeeder seeds two Agents and two Supervisors, plus the roles "Agent" and "Supervisor".<br>
<br>
2. Configure Frontend (/client)<br>
Navigate to client folder and install dependencies:<br>
<br>
cd ../client<br>
npm install<br>
Open /src/environments/environment.ts (and .development.ts) and ensure it includes:<br>
<br>
export const environment = {
  production: false,
  apiUrl: '/api'
};<br>
Angular CLI automatically replaces environment.ts depending on build mode. <br>
Microsoft Learn<br>
<br>
Run the app:<br>
<br>
ng serve --configuration=development --open<br>
By default, it launches on http://localhost:4200/. API calls are proxied to the backend defined in environment.apiUrl.<br>
<br>
▶️ Running the Solution<br>
To launch both backend & frontend simultaneously:<br>
<br>
From BricksSteelSolutionRoot:<br>
<br>
start cmd /k "cd ConstructionCompany.API & dotnet run"<br>
in a separate terminal:<br>
<br>
cd client && npm start<br>
You should see the public landing page. Click Login/Register, register an account (default role = Agent), and perform login flows.<br>
<br>
🔐 Sample Credentials<br>
Agents seeded:<br>
<br>
agent1@demo.com / Agent123!<br>
<br>
agent2@demo.com / Agent123!<br>
<br>
Supervisors seeded:<br>
<br>
supervisor1@demo / Supervisor123!<br>
<br>
supervisor2@demo / Supervisor123!<br>
<br>
🚪 Access URLs<br>
Role	After Login Redirect<br>
Agent	/agent/dashboard<br>
Supervisor	/supervisor/dashboard<br>
<br>
Unauthorized access to any agent/** or supervisor/** route will redirect to login and then back to the original path post-authentication.<br>
<br>
🎯 Notes on Authentication Flow<br>
Registration triggers immediate login, returning a JWT plus assigned role.<br>
<br>
Login endpoint at /api/auth/login verifies credentials, retrieves identity roles, constructs JWT with claims including ClaimTypes.Role.<br>
<br>
Authentication guard checks token presence + validity, decodes role from it, and sets navigation logic.<br>
<br>
HTTP interceptor automatically adds Authorization: Bearer <token> header.<br>
<br>
All of this aligns with the recommended SPA-auth patterns combined with ASP.NET Core Identity and JWT. <br>
<br>
📌 Common Issues & Troubleshooting<br>
JWT Key too short or invalid: You’ll get IDX10720: key size must be greater. Always use a 256-bit (32-character+) secret.<br>
<br>
CORS errors on login POST: Make sure the backend in Program.cs includes:<br>
<br>
builder.Services.AddCors(opts => opts.AddPolicy("AllowAll", p =>
     p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
app.UseCors("AllowAll");
Angular Cannot Redeclare FormControl or ngServe outside workspace issues: Ensure you’re running CLI commands from /client, not higher up.<br>
<br>
Role-based guard not working: Clear local storage and re-login to reset your user role in the @Injectable AuthService.<br>
<br>
📚 Useful References<br>
Angular environment configuration and CLI usage <br>
angular.dev<br>
<br>
Securing API endpoints using ASP.NET Core Identity with JWT for SPAs <br>
Microsoft Learn<br>
<br>
📄 License<br>
This work is provided for educational use. All code is under the MIT License. Feel free to reuse and adapt as permitted.<br>

