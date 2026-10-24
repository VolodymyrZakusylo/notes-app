using Microsoft.AspNetCore.Mvc;
using Notes.Api.Data;
using Microsoft.EntityFrameworkCore;
using Notes.Api.Dtos;
using Notes.Api.Models;

namespace Notes.Api.Controllers;

[ApiController]
[Route("notes")]
public class NotesController : ControllerBase
{
    private readonly NotesDbContext _dbContext;
    public NotesController(NotesDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<NoteResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var notes = await _dbContext.Notes
            .AsNoTracking()
            .OrderByDescending(note => note.CreatedAt)
            .Select(note => new NoteResponse(
                note.Id,
                note.Title,
                note.Content,
                note.CreatedAt,
                note.UpdatedAt))
            .ToListAsync(cancellationToken);

        return Ok(notes);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NoteResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var note = await _dbContext.Notes
            .AsNoTracking()
            .Where(note => note.Id == id)
            .Select(note => new NoteResponse(
                note.Id,
                note.Title,
                note.Content,
                note.CreatedAt,
                note.UpdatedAt))
            .FirstOrDefaultAsync(cancellationToken);

        if (note == null)
        {
            return NotFound();
        }

        return Ok(note);
    }

    [HttpPost]
    public async Task<ActionResult<NoteResponse>> Create(
    SaveNoteRequest request,
    CancellationToken cancellationToken)
    {
        var title = request.Title.Trim();
        var content = request.Content.Trim();

        if (string.IsNullOrWhiteSpace(title) ||
            string.IsNullOrWhiteSpace(content))
        {
            return BadRequest(new
            {
                message = "Title and content cannot be empty."
            });
        }

        var note = new Note
        {
            Title = title,
            Content = content
        };

        _dbContext.Notes.Add(note);

        await _dbContext.SaveChangesAsync(cancellationToken);

        var response = new NoteResponse(
            note.Id,
            note.Title,
            note.Content,
            note.CreatedAt,
            note.UpdatedAt);

        return CreatedAtAction(
            nameof(GetById),
            new { id = note.Id },
            response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<NoteResponse>> Update(
        Guid id,
        SaveNoteRequest request,
        CancellationToken cancellationToken)
    {
        var note = await _dbContext.Notes
            .FirstOrDefaultAsync(n => n.Id == id, cancellationToken);

        if (note == null)
        {
            return NotFound();
        }

        var title = request.Title.Trim();
        var content = request.Content.Trim();

        if (string.IsNullOrWhiteSpace(title) ||
            string.IsNullOrWhiteSpace(content))
        {
            return BadRequest(new
            {
                message = "Title and content cannot be empty."
            });
        }

        note.Title = title;
        note.Content = content;
        note.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        var response = new NoteResponse(
            note.Id,
            note.Title,
            note.Content,
            note.CreatedAt,
            note.UpdatedAt);

        return Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var note = await _dbContext.Notes
            .FirstOrDefaultAsync(n => n.Id == id, cancellationToken);

        if (note is null)
        {
            return NotFound();
        }

        _dbContext.Notes.Remove(note);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
