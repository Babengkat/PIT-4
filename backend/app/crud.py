from sqlalchemy.orm import Session
from . import models, schemas

# Create a new task
def create_todo(db: Session, todo: schemas.TodoCreate):
    db_todo = models.Todo(title=todo.title, completed=todo.completed)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

# Get all tasks
def get_all_todos(db: Session):
    return db.query(models.Todo).all()

# Get single task by ID
def get_todo(db: Session, todo_id: int):
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()

# Update a task
def update_todo(db: Session, todo_id: int, updated_todo: schemas.TodoUpdate):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if todo:
        todo.title = updated_todo.title
        todo.completed = updated_todo.completed
        db.commit()
        db.refresh(todo)
    return todo

# Delete a task
def delete_todo(db: Session, todo_id: int):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if todo:
        db.delete(todo)
        db.commit()
    return todo

# Filter tasks by completion status
def get_todos_by_status(db: Session, completed: bool):
    return db.query(models.Todo).filter(models.Todo.completed == completed).all()
