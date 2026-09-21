using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.DTOs;
using TodoApi.Models;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/todos")]
public class TodosController : ControllerBase
{
    private readonly TodoDbContext _db;

    public TodosController(TodoDbContext db)
    {
        _db = db;
    }

    // GET /api/todos -> ordered by SortOrder, then Id.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodos()
    {
        var todos = await _db.Todos
            .OrderBy(t => t.SortOrder)
            .ThenBy(t => t.Id)
            .ToListAsync();
        return Ok(todos);
    }

    // GET /api/todos/{id} -> single item (used by CreatedAtAction on POST).
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TodoItem>> GetTodoById(int id)
    {
        var todo = await _db.Todos.FindAsync(id);
        if (todo is null)
        {
            return NotFound();
        }

        return Ok(todo);
    }

    // POST /api/todos {description} -> creates last (max SortOrder + 1).
    [HttpPost]
    public async Task<ActionResult<TodoItem>> CreateTodo(CreateTodoDto dto)
    {
        var maxSortOrder = await _db.Todos.MaxAsync(t => (int?)t.SortOrder);
        var now = DateTime.UtcNow;

        var todo = new TodoItem
        {
            Description = dto.Description ?? string.Empty,
            IsCompleted = false,
            SortOrder = (maxSortOrder ?? -1) + 1,
            CreatedAt = now,
            UpdatedAt = now,
        };

        _db.Todos.Add(todo);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTodoById), new { id = todo.Id }, todo);
    }

    // PUT /api/todos/reorder [{id, sortOrder}] -> must be defined BEFORE /{id}.
    [HttpPut("reorder")]
    public async Task<IActionResult> ReorderTodos(List<ReorderDto> items)
    {
        foreach (var item in items)
        {
            var todo = await _db.Todos.FindAsync(item.Id);
            if (todo is null)
            {
                continue;
            }

            todo.SortOrder = item.SortOrder;
            todo.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        return NoContent();
    }

    // PUT /api/todos/{id} {description, isCompleted} -> no validation.
    [HttpPut("{id:int}")]
    public async Task<ActionResult<TodoItem>> UpdateTodo(int id, UpdateTodoDto dto)
    {
        var todo = await _db.Todos.FindAsync(id);
        if (todo is null)
        {
            return NotFound();
        }

        todo.Description = dto.Description ?? string.Empty;
        todo.IsCompleted = dto.IsCompleted;
        todo.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(todo);
    }

    // DELETE /api/todos/{id} -> 204, 404 if missing.
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        var todo = await _db.Todos.FindAsync(id);
        if (todo is null)
        {
            return NotFound();
        }

        _db.Todos.Remove(todo);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
