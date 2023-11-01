namespace Phocon.Server.Models;

public class NotificationDto
{
    public string Id { get; set; }
    public byte[] Icon { get; set; }
    public string AppName { get; set; }
    public string? Sender { get; set; }
    public string Message { get; set; }
}