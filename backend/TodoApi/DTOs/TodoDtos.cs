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
