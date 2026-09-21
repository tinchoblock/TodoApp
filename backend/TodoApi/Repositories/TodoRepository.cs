using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;

namespace TodoApi.Repositories;

public class TodoRepository : ITodoRepository
{
    private readonly TodoDbContext _db;

    public TodoRepository(TodoDbContext db)
    {
        _db = db;
    }

    public Task<List<TodoItem>> GetAllOrderedAsync()
    {
        return _db.Todos
            .OrderBy(t => t.SortOrder)
            .ThenBy(t => t.Id)
            .ToListAsync();
    }

    public Task<TodoItem?> GetByIdAsync(int id)
    {
        return _db.Todos.FindAsync(id).AsTask();
    }

    public Task AddAsync(TodoItem entity)
    {
        return _db.Todos.AddAsync(entity).AsTask();
    }

    public void Update(TodoItem entity)
    {
        _db.Todos.Update(entity);
    }

    public void Remove(TodoItem entity)
    {
        _db.Todos.Remove(entity);
    }

    public async Task<int> GetMaxSortOrderAsync()
    {
        var max = await _db.Todos.MaxAsync(t => (int?)t.SortOrder);
        return max ?? -1;
    }

    public Task SaveChangesAsync()
    {
        return _db.SaveChangesAsync();
    }
}
