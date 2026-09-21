using TodoApi.Adapters;
using TodoApi.DTOs;
using TodoApi.Models;
using TodoApi.Repositories;

namespace TodoApi.Services;

public class TodoService : ITodoService
{
    private readonly ITodoRepository _repo;

    public TodoService(ITodoRepository repo)
    {
        _repo = repo;
    }

    public Task<List<TodoItem>> GetAllAsync()
    {
        return _repo.GetAllOrderedAsync();
    }

    public Task<TodoItem?> GetByIdAsync(int id)
    {
        return _repo.GetByIdAsync(id);
    }

    public async Task<TodoItem> CreateAsync(CreateTodoDto dto)
    {
        var maxSortOrder = await _repo.GetMaxSortOrderAsync();
        var now = DateTime.UtcNow;
        var todo = TodoMapper.ToEntity(dto, maxSortOrder + 1, now);
        await _repo.AddAsync(todo);
        await _repo.SaveChangesAsync();
        return todo;
    }

    public async Task<TodoItem?> UpdateAsync(int id, UpdateTodoDto dto)
    {
        var todo = await _repo.GetByIdAsync(id);
        if (todo is null)
        {
            return null;
        }

        TodoMapper.ApplyUpdate(todo, dto, DateTime.UtcNow);
        await _repo.SaveChangesAsync();
        return todo;
    }

    public async Task ReorderAsync(List<ReorderDto> items)
    {
        var now = DateTime.UtcNow;
        foreach (var item in items)
        {
            var todo = await _repo.GetByIdAsync(item.Id);
            if (todo is null)
            {
                continue;
            }

            todo.SortOrder = item.SortOrder;
            todo.UpdatedAt = now;
        }

        await _repo.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var todo = await _repo.GetByIdAsync(id);
        if (todo is null)
        {
            return false;
        }

        _repo.Remove(todo);
        await _repo.SaveChangesAsync();
        return true;
    }
}
