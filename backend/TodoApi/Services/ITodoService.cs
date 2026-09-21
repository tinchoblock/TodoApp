using TodoApi.DTOs;
using TodoApi.Models;

namespace TodoApi.Services;

public interface ITodoService
{
    Task<List<TodoItem>> GetAllAsync();

    Task<TodoItem?> GetByIdAsync(int id);

    Task<TodoItem> CreateAsync(CreateTodoDto dto);

    Task<TodoItem?> UpdateAsync(int id, UpdateTodoDto dto);

    Task ReorderAsync(List<ReorderDto> items);

    Task<bool> DeleteAsync(int id);
}
