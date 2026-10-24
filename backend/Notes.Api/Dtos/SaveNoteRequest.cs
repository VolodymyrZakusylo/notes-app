using System.ComponentModel.DataAnnotations;

namespace Notes.Api.Dtos;

public sealed record SaveNoteRequest(
    [Required]
    [StringLength(100, MinimumLength = 1)]
    string Title,

    [Required]
    [StringLength(5000, MinimumLength = 1)]
    string Content);
