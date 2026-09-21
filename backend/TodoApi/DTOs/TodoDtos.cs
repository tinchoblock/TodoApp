namespace TodoApi.DTOs;

public class CreateTodoDto
{
    public string? Description { get; set; }
}

public class UpdateTodoDto
{
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
}

public class ReorderDto
{
    public int Id { get; set; }
    public int SortOrder { get; set; }
}

public class TodoResponseDto
{
    public int Id { get; set; }

    public string Description { get; set; } = string.Empty;

    public bool IsCompleted { get; set; }

    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
