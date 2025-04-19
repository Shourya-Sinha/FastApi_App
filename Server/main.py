from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .Routes.Todo_route import router as TodoRouter
from fastapi.responses import FileResponse,RedirectResponse
import os
app = FastAPI()

vite_dist_path = os.path.join(os.path.dirname(__file__), "../Client/dist")
assets_path = os.path.join(vite_dist_path, "assets")

if not os.path.exists(assets_path):
    raise RuntimeError("❌ Frontend not built. Run `cd Client && npm run build`")

# app.mount("/static", StaticFiles(directory=vite_dist_path), name="static")
app.mount("/static", StaticFiles(directory=vite_dist_path), name="static")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Routes
app.include_router(TodoRouter,prefix="/api/todos",tags=["Todos"])

@app.get("/")
async def redirect_to_dashboard():
    return RedirectResponse(url="/dashboard")

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    # Return index.html for all other paths (React Router handles them)
    return FileResponse(os.path.join(vite_dist_path, "index.html"))
