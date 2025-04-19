from fastapi import APIRouter, HTTPException
from Models.Todo_Model import TodoModel, UpdateTodoModel
from Controllers import Todo_Controller
from pydantic import BaseModel
from bson.errors import InvalidId

router = APIRouter()


class CompleteTodoModel(BaseModel):
    completedAt: str


@router.post("/create-task")
async def create_task(data: TodoModel):
    todos = await Todo_Controller.create_todo(data)
    return {"status": "success", "message": "Fetched successfully", "data": todos}


@router.get("/get-all-task")
async def get_all_task():
    todos = await Todo_Controller.get_all_todos()
    return {"status": "success", "message": "Fetched successfully", "data": todos}

@router.get("/get-completed-task")
async def get_completed_tasks():
    todos = await Todo_Controller.get_all_completed_task()
    return {"status":"success","message":"Fetched successfully","data":todos}

@router.get("/get-single-task/{id}")
async def get_single_task(id: str):
    todo = await Todo_Controller.get_todo(id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"status": "success", "message": "Fetched successfully", "data": todo}


@router.put("/update-task/{id}")
async def update_task(id: str, todo: UpdateTodoModel):
    try:
        updated_task = await Todo_Controller.update_todo(id, todo)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid Task ID")
    return {
        "status": "success",
        "message": "Task updated successfully",
        "data": updated_task,
    }


@router.put("/complete-task/{id}")
async def complete_task(id: str, data: CompleteTodoModel):
    result = await Todo_Controller.complete_todo(id, data.completedAt)
    return {"status": "success", "message": "Task marked as completed", "data": result}


@router.delete("/delete-task/{id}")
async def delete_task(id: str):
    success = await Todo_Controller.delete_todo(id)
    if success:
        return {"status": "success", "message": "Task deleted successfully"}
    raise HTTPException(status_code=404, detail="Todo Task not found")


@router.get("/all-stats")
async def get_all_stats():
    print("✅ all-stats route hit!")
    result = await Todo_Controller.get_todo_stats()
    return {
        "status": "success",
        "message": "Get all stats successfully",
        "data": result
    }