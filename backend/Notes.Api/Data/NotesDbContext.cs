using Microsoft.EntityFrameworkCore;
using Notes.Api.Models;

namespace Notes.Api.Data;
public class NotesDbContext : DbContext
{
    public NotesDbContext(DbContextOptions<NotesDbContext> options) : base(options)
    {
    }

    public DbSet<Note> Notes => Set<Note>();
}
