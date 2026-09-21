using TodoApi.Models;

namespace TodoApi.Repositories;

public interface ITodoRepository
{
    Task<List<TodoItem>> GetAllOrderedAsync();

    Task<TodoItem?> GetByIdAsync(int id);

    Task AddAsync(TodoItem entity);

    void Update(TodoItem entity);

    void Remove(TodoItem entity);

    Task<int> GetMaxSortOrderAsync();

    Task SaveChangesAsync();
}
