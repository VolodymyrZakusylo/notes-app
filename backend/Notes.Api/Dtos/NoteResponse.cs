namespace Notes.Api.Dtos;

public sealed record NoteResponse(
    Guid Id,
    string Title,
    string Content,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
