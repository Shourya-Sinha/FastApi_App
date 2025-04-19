from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routes.Todo_route import router as TodoRouter

app = FastAPI()

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