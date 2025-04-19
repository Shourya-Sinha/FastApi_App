from Config.Database import database
from bson import ObjectId
from datetime import datetime, timedelta
from fastapi import HTTPException
from Models.Todo_Model import TodoModel
from dateutil import parser

todo_collection = database["todos"]

def format_date(val):
    return val.strftime("%Y-%m-%d %H:%M:%S") if isinstance(val, datetime) else str(val) if val else None

# def todo_serializer(todo) -> dict:
#     return {
#         "id": str(todo["_id"]),
#         "title": todo["title"],
#         "description": todo.get("description"),
#         "completed": todo["completed"],
#         "completedAt": (
#             str(todo.get("completedAt")) if todo.get("completedAt") else None
#         ),
#         "updatedAt": str(todo.get("updatedAt")) if todo.get("updatedAt") else None,
#         "createdAt": str(todo.get("createdAt")) if todo.get("createdAt") else None,
#         "expireAt": str(todo.get("expireAt")) if todo.get("expireAt") else None,
#     }

def todo_serializer(todo) -> dict:
    return {
        "id": str(todo.get("_id", "")),
        "title": todo.get("title", ""),
        "description": todo.get("description", ""),
        "completed": todo.get("completed", False),
        "completedAt": format_date(todo.get("completedAt")),
        "updatedAt": format_date(todo.get("updatedAt")),
        "createdAt": format_date(todo.get("createdAt")),
        "expireAt": format_date(todo.get("expireAt")),
    }


async def create_todo(data: TodoModel):
    todo_data = data.dict()

    # Simple server-side validation (optional)
    if not todo_data.get("createdAt"):
        raise HTTPException(status_code=400, detail="createdAt must be provided")
    
    if not todo_data.get("expireAt"):
        raise HTTPException(status_code=404,detail="Expiry Time Must be provided")

    # todo_data["updatedAt"] = datetime.utcnow()

    result = await todo_collection.insert_one(todo_data)

    if result.inserted_id:
        todo = await todo_collection.find_one({"_id": result.inserted_id})
        print("inserted id",result.inserted_id)
        return todo_serializer(todo)
    else:
        raise HTTPException(status_code=500, detail="Todo creation failed")


async def get_all_todos():
    todos = []
    cursor = todo_collection.find({"completed":False}).sort("createdAt", -1)
    async for todo in cursor:
        todos.append(todo_serializer(todo))
    return todos


async def get_todo(id: str):
    todo = await todo_collection.find_one({"_id": ObjectId(id)})
    return todo_serializer(todo) if todo else None


async def update_todo(id: str, data):
    update_data = data.dict(exclude_unset=True)
    if "updatedAt" not in update_data:
        raise ValueError("updatedAt must be provided from user")
    await todo_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    todo = await todo_collection.find_one({"_id": ObjectId(id)})
    return todo_serializer(todo)


async def delete_todo(id: str):
    result = await todo_collection.delete_one({"_id": ObjectId(id)})
    return result.deleted_count > 0


async def complete_todo(id: str, completedAt: str):
    if not completedAt:
        raise ValueError("completedAt must be provided from user (local time)")
    await todo_collection.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "completed": True,
                "completedAt": completedAt,
            }
        },
    )
    todo = await todo_collection.find_one({"_id": ObjectId(id)})
    return todo_serializer(todo)


async def get_all_completed_task():
    todos = []
    cursor = todo_collection.find({"completed": True}).sort("completedAt",-1)
    async for todo in cursor:
        todos.append(todo_serializer(todo))
    return todos


async def get_todo_stats():
    now = datetime.utcnow()  # Use UTC time for consistency
    today_start = datetime(now.year, now.month, now.day)  # Start of today
    ten_minutes_from_now = now + timedelta(minutes=10)
    print("current utc time",datetime.utcnow())
    print("expirytime calculating",ten_minutes_from_now)
    

    stats = {
        "total_tasks": 0,  # All tasks (active, completed, expired, etc.)
        "total_active_tasks": 0,  # Active tasks (not completed)
        "total_completed_tasks": 0,  # Completed tasks
        "total_today_tasks": 0,  # Tasks created today
        "total_coming_to_expire_tasks": 0,  # Tasks that are near expiry
    }

    cursor = todo_collection.find()
    async for todo in cursor:
        created_str = todo.get("createdAt")
        completed = todo.get("completed", False)
        expire_str = todo.get("expireAt")

        # Set expire_at = None by default
        expire_at = None
        print("created at",created_str)
        # Check if created_str is already a datetime object
        if isinstance(created_str, datetime):
            created_at = created_str
        else:
            try:
                created_at = parser.parse(created_str)
            except (ValueError, TypeError):
                continue

        # Check if expire_str is a valid datetime object
        # if expire_str:
        #     if isinstance(expire_str, datetime):
        #         expire_at = expire_str
        #     else:
        #         try:
        #             expire_at = datetime.strptime(expire_str, "%Y-%m-%dT%H:%M:%S.%f")
        #         except (ValueError, TypeError):
        #             expire_at = None
        if expire_str:
            if isinstance(expire_str, datetime):
                expire_at = expire_str
            else:
                try:
                    expire_at = parser.parse(expire_str)
                except (ValueError, TypeError):
                    expire_at = None

        # Total Tasks
        stats["total_tasks"] += 1

        # Today Task (Created today)
        if created_at >= today_start:
            stats["total_today_tasks"] += 1

        # Completed Task
        if completed:
            stats["total_completed_tasks"] += 1

        # Active tasks (not completed)
        if not completed:
            stats["total_active_tasks"] += 1

        # Coming to Expire (Tasks expiring in the next 10 minutes)
        if not completed and expire_at and now <= expire_at <= ten_minutes_from_now:
            stats["total_coming_to_expire_tasks"] += 1

    return stats