using System.Net.NetworkInformation;
using System.Net.Sockets;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Phocon.Server;
using Phocon.Server.Models;

var isPaired = false;
PairCreateDto? pairModel = null;
List<NotificationDto> unreadNotifications = new();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

var app = builder
    .Build();

app.UseCors((b) => b.AllowAnyOrigin());

app.MapGet("/", () => "Hello World!");

app.MapGet("/state", () =>
{
    var ips = new List<object>();
    var netInterfaces = NetworkInterface.GetAllNetworkInterfaces()
        .Where(i => i.OperationalStatus == OperationalStatus.Up &&
                    (i.NetworkInterfaceType == NetworkInterfaceType.Wireless80211
                     || i.NetworkInterfaceType == NetworkInterfaceType.Ethernet));
    foreach (var netInterface in netInterfaces)
    {
        try
        {
            var netIps = netInterface.GetIPProperties().UnicastAddresses
                .Where(i => i.Address.AddressFamily == AddressFamily.InterNetwork &&
                            i.Address.ToString() != "127.0.0.1").ToArray();

            if (netIps.Any())
            {
                ips.AddRange(netIps.Select(i => new
                {
                    name = netInterface.Description,
                    ip = i.Address.ToString()
                }));
            }
        }
        catch
        {
            //
        }
    }

    return new
    {
        isPaired,
        ips,
        deviceName = pairModel?.DeviceName
    };
});

app.MapPost("/pair", async Task (req) =>
{
    pairModel = await req.Request.ReadFromJsonAsync<PairCreateDto>();
    isPaired = true;
    await req.Response.WriteAsJsonAsync(new { isError = false });
});

app.MapGet("/notifications", () => unreadNotifications);

app.MapPost("/notifications", async Task (req) =>
{
    var nots = await req.Request.ReadFromJsonAsync<List<NotificationDto>>();
    if (nots != null)
    {
        unreadNotifications = nots;
    }
    await req.Response.WriteAsJsonAsync(new { isError = false });
});

try
{
    WinFirewall.SetFirewallException("Com.Neroxt.PhoneCon.Server", typeof(Program).Assembly.Location);
}
catch (Exception ex)
{
    Console.WriteLine(ex);
}

app.Run("http://localhost:26262/");