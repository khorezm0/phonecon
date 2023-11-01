namespace Phocon.Server.Models;

public class PairCreateDto
{
    public string DeviceName { get; set; }
    public string DeviceId { get; set; }
    public string BatteryPercent { get; set; }
    public string IsWifiEnabled { get; set; }
    public string IsBluetoothEnabled { get; set; }
    public byte[] WallpaperImage { get; set; }
    public string WallpaperImageContentType { get; set; }
}