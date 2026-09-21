using Microsoft.AspNetCore.Mvc;
using TodoApi.Adapters;
using TodoApi.DTOs;
using TodoApi.Services;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/todos")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _service;

    public TodosController(ITodoService service)
    {
        _service = service;
    }

    // GET /api/todos -> ordered by SortOrder, then Id.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoResponseDto>>> GetTodos()
    {
        var todos = await _service.GetAllAsync();
        return Ok(TodoMapper.ToResponseDtoList(todos));
    }

    // GET /api/todos/{id} -> single item (used by CreatedAtAction on POST).
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TodoResponseDto>> GetTodoById(int id)
    {
        var todo = await _service.GetByIdAsync(id);
        if (todo is null)
        {
            return NotFound();
        }

        return Ok(TodoMapper.ToResponseDto(todo));
    }

    // POST /api/todos {description} -> creates last (max SortOrder + 1).
    [HttpPost]
    public async Task<ActionResult<TodoResponseDto>> CreateTodo(CreateTodoDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetTodoById), new { id = created.Id }, TodoMapper.ToResponseDto(created));
    }

    // PUT /api/todos/reorder [{id, sortOrder}] -> must be defined BEFORE /{id}.
    [HttpPut("reorder")]
    public async Task<IActionResult> ReorderTodos(List<ReorderDto> items)
    {
        await _service.ReorderAsync(items);
        return NoContent();
    }

    // PUT /api/todos/{id} {description, isCompleted} -> no validation.
    [HttpPut("{id:int}")]
    public async Task<ActionResult<TodoResponseDto>> UpdateTodo(int id, UpdateTodoDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        if (updated is null)
        {
            return NotFound();
        }

        return Ok(TodoMapper.ToResponseDto(updated));
    }

    // DELETE /api/todos/{id} -> 204, 404 if missing.
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
