using System.Diagnostics;

namespace Phocon.Server;

public class WinFirewall
{
    public static void SetFirewallException(string ruleName, string exePath)
    {

        string script = $@"netsh advfirewall firewall show rule name=""{ruleName}"" > nul & if errorlevel 1 (netsh advfirewall firewall add rule name=""{ruleName}"" dir=in action=allow program=""{exePath}"" enable=yes) else (netsh advfirewall firewall set rule name=""{ruleName}"" new program=""{exePath}"")";

        Process process = new Process();
        process.StartInfo.FileName = "cmd.exe";
        process.StartInfo.Arguments = "/c " + script;
        process.StartInfo.UseShellExecute = false;
        process.StartInfo.CreateNoWindow = true;
        process.StartInfo.RedirectStandardOutput = true;
        process.StartInfo.RedirectStandardError = true;
        process.ErrorDataReceived += build_ErrorDataReceived;
        process.OutputDataReceived += build_ErrorDataReceived;
        process.EnableRaisingEvents = true;
        process.Start();
        process.BeginOutputReadLine();
        process.BeginErrorReadLine();
        process.WaitForExit();

        if (process.ExitCode != 0)
        {
            Console.WriteLine("Firewall exit code: " + process.ExitCode);
        }
    }
    
    // write out info to the display window
    static void build_ErrorDataReceived(object sender, DataReceivedEventArgs e)
    {
        if (!string.IsNullOrEmpty(e.Data))
            Console.WriteLine(e.Data);
    } 
}