using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace OmniFinance;

public record MpesaConfig(
    string ConsumerKey,
    string ConsumerSecret,
    string ShortCode,
    string PassKey,
    string CallbackUrl,
    string BaseUrl = "https://sandbox.safaricom.co.ke"
);

public class MpesaService
{
    private readonly HttpClient _http;
    private readonly MpesaConfig _config;
    private string? _accessToken;
    private DateTime _tokenExpiry;

    public MpesaService(HttpClient http, IConfiguration config)
    {
        _http = http;
        // Sandbox credentials - shortcode 174379 is the Safaricom test paybill
        _config = new MpesaConfig(
            config["MPESA_CONSUMER_KEY"] ?? "",
            config["MPESA_CONSUMER_SECRET"] ?? "",
            "174379", // Sandbox test shortcode
            config["MPESA_PASSKEY"] ?? "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
            config["MPESA_CALLBACK_URL"] ?? "https://mydomain.com/api/mpesa/callback",
            config["MPESA_ENV"] == "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke"
        );
    }
    


    private async Task<string> GetAccessTokenAsync()
    {
        if (_accessToken != null && DateTime.Now < _tokenExpiry)
            return _accessToken;

        var authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_config.ConsumerKey}:{_config.ConsumerSecret}"));
        var request = new HttpRequestMessage(HttpMethod.Get, $"{_config.BaseUrl}/oauth/v1/generate?grant_type=client_credentials");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authHeader);

        var response = await _http.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TokenResponse>(content);
        
        _accessToken = result?.AccessToken ?? throw new Exception("Failed to get access token");
        _tokenExpiry = DateTime.Now.AddSeconds(int.Parse(result.ExpiresIn ?? "3599") - 60);

        return _accessToken;
    }

    public async Task<object> TriggerStkPushAsync(string phoneNumber, decimal amount, string reference = "OmniLogistics")
    {
        var token = await GetAccessTokenAsync();
        
        // Generate timestamp in format yyyyMMddHHmmss
        var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
        
        // Password = base64(BusinessShortCode + PassKey + Timestamp)
        var password = Convert.ToBase64String(Encoding.UTF8.GetBytes($"174379{_config.PassKey}{timestamp}"));

        // Format phone number (must be 254...)
        if (phoneNumber.StartsWith("0")) phoneNumber = "254" + phoneNumber.Substring(1);
        if (phoneNumber.StartsWith("+")) phoneNumber = phoneNumber.Substring(1);

        // Build the exact payload format for Safaricom sandbox
        var payload = new
        {
            BusinessShortCode = "174379",
            Password = password,
            Timestamp = timestamp,
            TransactionType = "CustomerPayBillOnline",
            Amount = (int)amount,
            PartyA = phoneNumber,
            PartyB = "174379",
            PhoneNumber = phoneNumber,
            CallBackURL = _config.CallbackUrl,
            AccountReference = reference,
            TransactionDesc = $"Payment for {reference}"
        };

        Console.WriteLine($"[M-Pesa] Sending STK Push to {phoneNumber}, Amount: {amount}, Timestamp: {timestamp}");
        Console.WriteLine($"[M-Pesa] Password: {password}");
        Console.WriteLine($"[M-Pesa] Payload: {JsonSerializer.Serialize(payload)}");

        var request = new HttpRequestMessage(HttpMethod.Post, $"{_config.BaseUrl}/mpesa/stkpush/v1/processrequest");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        var response = await _http.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();
        
        Console.WriteLine($"[M-Pesa] Response Status: {response.StatusCode}");
        Console.WriteLine($"[M-Pesa] Response: {content}");
        
        try 
        {
            response.EnsureSuccessStatusCode();
            return JsonSerializer.Deserialize<object>(content)!;
        }
        catch
        {
            // Return detailed error for debugging
            throw new Exception($"Safaricom Error ({response.StatusCode}): {content}");
        }
    }

    private class TokenResponse
    {
        [JsonPropertyName("access_token")]
        public string? AccessToken { get; set; }
        [JsonPropertyName("expires_in")]
        public string? ExpiresIn { get; set; }
    }
}
