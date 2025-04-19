from pydantic import BaseModel,Field
from typing import Optional
from bson import ObjectId
from datetime import datetime

class TodoModel(BaseModel):
    title:str = Field(...)
    description: Optional[str] = None
    completed:bool = False
    createdAt: datetime
    expireAt:datetime
    updatedAt:Optional[datetime] = None
    completedAt:Optional[datetime] = None

class UpdateTodoModel(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    updatedAt: datetime
    expireAt:datetime
    completedAt: Optional[datetime] = None