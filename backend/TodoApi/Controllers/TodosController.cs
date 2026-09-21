using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TodoApi.Adapters;
using TodoApi.DTOs;
using TodoApi.Hubs;
using TodoApi.Services;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/todos")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _service;
    private readonly IHubContext<TodoHub> _hub;

    public TodosController(ITodoService service, IHubContext<TodoHub> hub)
    {
        _service = service;
        _hub = hub;
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
        var todo = TodoMapper.ToResponseDto(created);
        await BroadcastAsync("TodoChanged", new { type = "created", todo });
        return CreatedAtAction(nameof(GetTodoById), new { id = created.Id }, todo);
    }

    // PUT /api/todos/reorder [{id, sortOrder}] -> must be defined BEFORE /{id}.
    [HttpPut("reorder")]
    public async Task<IActionResult> ReorderTodos(List<ReorderDto> items)
    {
        await _service.ReorderAsync(items);
        var ordered = items.OrderBy(i => i.SortOrder).Select(i => new { id = i.Id, sortOrder = i.SortOrder }).ToList();
        await BroadcastAsync("TodoChanged", new { type = "reordered", todos = ordered });
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

        var todo = TodoMapper.ToResponseDto(updated);
        await BroadcastAsync("TodoChanged", new { type = "updated", todo });
        return Ok(todo);
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

        await BroadcastAsync("TodoChanged", new { type = "deleted", id });
        return NoContent();
    }

    // IHubContext<TodoHub>.Clients has no Others/Caller (hub-side only).
    // Emulate Others: if the caller passes its SignalR connection id
    // (?connectionId=... or X-Connection-Id header), exclude it via
    // AllExcept; otherwise fall back to All. Caller already did an
    // optimistic update, so receiving its own echo is harmless (T07 filters it).
    private Task BroadcastAsync(string method, object payload)
    {
        var excluded = GetCallerConnectionIds();
        return excluded.Count > 0
            ? _hub.Clients.AllExcept(excluded).SendAsync(method, payload)
            : _hub.Clients.All.SendAsync(method, payload);
    }

    private IReadOnlyList<string> GetCallerConnectionIds()
    {
        var ids = new List<string>();
        var query = HttpContext.Request.Query["connectionId"].ToString();
        if (!string.IsNullOrWhiteSpace(query))
        {
            ids.Add(query);
        }

        foreach (var headerName in new[] { "X-Connection-Id", "X-SignalR-ConnectionId" })
        {
            var header = HttpContext.Request.Headers[headerName].ToString();
            if (!string.IsNullOrWhiteSpace(header) && !ids.Contains(header))
            {
                ids.Add(header);
            }
        }

        return ids;
    }
}
