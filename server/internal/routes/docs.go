package routes

import "github.com/gofiber/fiber/v3"

func ServeAPIDocs(c fiber.Ctx) error {
	html := `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Co-op Credit Evaluator API</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 2rem; background: #f9fafb; text-align: left;}
        h1 { color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; margin-bottom: 2rem; }
        h2 { color: #4b5563; margin-top: 2rem; margin-bottom: 1rem; }
        .endpoint { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); display: flex; flex-direction: column;}
        .endpoint-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
        .endpoint-route { display: flex; align-items: center; }
        .method { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: white; margin-right: 1rem; min-width: 60px; text-align: center; }
        .get { background-color: #3b82f6; }
        .post { background-color: #10b981; }
        .patch { background-color: #f59e0b; }
        .delete { background-color: #ef4444; }
        .path { font-family: Consolas, Monaco, monospace; font-size: 1rem; font-weight: 600; color: #1f2937; }
        .description { color: #4b5563; font-size: 0.95rem; }
        .badges { display: flex; gap: 0.5rem; }
        .auth-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; background-color: #fce7f3; color: #be185d; }
        .super-admin { background-color: #fef08a; color: #a16207; }
    </style>
</head>
<body>
    <h1>Co-op Credit Evaluator API Docs</h1>
    <p>Welcome to the API endpoints documentation for the Backend service.</p>

    <h2>System</h2>
    <div class="endpoint">
        <div class="endpoint-header">
            <div class="endpoint-route"><span class="method get">GET</span><span class="path">/health</span></div>
        </div>
        <div class="description">Check the API's operational status.</div>
    </div>

    <h2>Authentication</h2>
    <div class="endpoint">
        <div class="endpoint-header">
            <div class="endpoint-route"><span class="method post">POST</span><span class="path">/api/v1/auth/register-admin</span></div>
        </div>
        <div class="description">Register a new administrator into the system.</div>
    </div>
    <div class="endpoint">
        <div class="endpoint-header">
            <div class="endpoint-route"><span class="method post">POST</span><span class="path">/api/v1/auth/login-admin</span></div>
        </div>
        <div class="description">Login functionality that sets the secure authentication JWT cookie.</div>
    </div>
    <div class="endpoint">
        <div class="endpoint-header">
            <div class="endpoint-route"><span class="method get">GET</span><span class="path">/api/v1/protected/me</span></div>
            <div class="badges"><span class="auth-badge">Auth Required</span></div>
        </div>
        <div class="description">Fetch currently authenticated administrator's profile.</div>
    </div>
    <div class="endpoint">
        <div class="endpoint-header">
            <div class="endpoint-route"><span class="method post">POST</span><span class="path">/api/v1/protected/logout</span></div>
            <div class="badges"><span class="auth-badge">Auth Required</span></div>
        </div>
        <div class="description">Destroy the local session and clear the authentication cookie.</div>
    </div>

    <h2>Super Admin Controls</h2>
    <div class="endpoint">
        <div class="endpoint-header">
            <div class="endpoint-route"><span class="method get">GET</span><span class="path">/api/v1/protected/admins</span></div>
            <div class="badges"><span class="auth-badge super-admin">Super Admin Only</span></div>
        </div>
        <div class="description">List and search system administrators (query parameters: ?search=&page=&limit=).</div>
    </div>
    <div class="endpoint">
        <div class="endpoint-header">
            <div class="endpoint-route"><span class="method patch">PATCH</span><span class="path">/api/v1/protected/admins/:id/role</span></div>
            <div class="badges"><span class="auth-badge super-admin">Super Admin Only</span></div>
        </div>
        <div class="description">Modify an administrator's privilege level (Role: "ADMIN" | "SUPER_ADMIN").</div>
    </div>
    <div class="endpoint">
        <div class="endpoint-header">
            <div class="endpoint-route"><span class="method get">GET</span><span class="path">/api/v1/protected/evaluate-logs</span></div>
            <div class="badges"><span class="auth-badge super-admin">Super Admin Only</span></div>
        </div>
        <div class="description">Access the activity logging for evaluate tracking (Create, Update, Delete).</div>
    </div>

    <h2>Evaluations (Core)</h2>
    <div class="endpoint">
        <div class="endpoint-header">
            <div class="endpoint-route"><span class="method get">GET</span><span class="path">/api/v1/protected/evaluates</span></div>
            <div class="badges"><span class="auth-badge">Auth Required</span></div>
        </div>
        <div class="description">Fetch evaluations matching current admin's ID with extensive filters.</div>
    </div>
    <div class="endpoint">
        <div class="endpoint-header">
            <div class="endpoint-route"><span class="method post">POST</span><span class="path">/api/v1/protected/evaluates</span></div>
            <div class="badges"><span class="auth-badge">Auth Required</span></div>
        </div>
        <div class="description">Process and persist a totally new credit evaluation transaction.</div>
    </div>
    <div class="endpoint">
        <div class="endpoint-header">
            <div class="endpoint-route"><span class="method get">GET</span><span class="path">/api/v1/protected/evaluates/:id</span></div>
            <div class="badges"><span class="auth-badge">Auth Required</span></div>
        </div>
        <div class="description">Get a single targeted evaluate result format via its UUID.</div>
    </div>
    <div class="endpoint">
        <div class="endpoint-header">
            <div class="endpoint-route"><span class="method patch">PATCH</span><span class="path">/api/v1/protected/evaluates/:id</span></div>
            <div class="badges"><span class="auth-badge">Auth Required</span></div>
        </div>
        <div class="description">Rewrite and update an existing evaluation. Overwrites sub-fields carefully.</div>
    </div>
    <div class="endpoint">
        <div class="endpoint-header">
            <div class="endpoint-route"><span class="method delete">DELETE</span><span class="path">/api/v1/protected/evaluates/:id</span></div>
            <div class="badges"><span class="auth-badge">Auth Required</span></div>
        </div>
        <div class="description">Soft/Hard delete the evaluation (based on ORM definitions).</div>
    </div>
</body>
</html>`
	c.Set("Content-Type", "text/html")
	return c.SendString(html)
}
