using TodoApi.DTOs;
using TodoApi.Models;

namespace TodoApi.Adapters;

public static class TodoMapper
{
    public static TodoResponseDto ToResponseDto(TodoItem e)
    {
        return new TodoResponseDto
        {
            Id = e.Id,
            Description = e.Description,
            IsCompleted = e.IsCompleted,
            SortOrder = e.SortOrder,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt,
        };
    }

    public static List<TodoResponseDto> ToResponseDtoList(IEnumerable<TodoItem> entities)
    {
        return entities.Select(ToResponseDto).ToList();
    }

    public static TodoItem ToEntity(CreateTodoDto dto, int sortOrder, DateTime now)
    {
        return new TodoItem
        {
            Description = dto.Description ?? string.Empty,
            IsCompleted = false,
            SortOrder = sortOrder,
            CreatedAt = now,
            UpdatedAt = now,
        };
    }

    public static void ApplyUpdate(TodoItem entity, UpdateTodoDto dto, DateTime now)
    {
        entity.Description = dto.Description ?? string.Empty;
        entity.IsCompleted = dto.IsCompleted;
        entity.UpdatedAt = now;
    }
}
