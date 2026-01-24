using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace OmniFinance;

public record MpesaConfig(
    string ConsumerKey,
    string ConsumerSecret,
    string ShortCode,
    string PassKey,
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
        _config = new MpesaConfig(
            config["MPESA_CONSUMER_KEY"] ?? "",
            config["MPESA_CONSUMER_SECRET"] ?? "",
            config["MPESA_SHORTCODE"] ?? "174379",
            config["MPESA_PASSKEY"] ?? "",
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
        var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
        var password = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_config.ShortCode}{_config.PassKey}{timestamp}"));

        // Format phone number (must be 254...)
        if (phoneNumber.StartsWith("0")) phoneNumber = "254" + phoneNumber.Substring(1);
        if (phoneNumber.StartsWith("+")) phoneNumber = phoneNumber.Substring(1);

        var payload = new
        {
            BusinessShortCode = _config.ShortCode,
            Password = password,
            Timestamp = timestamp,
            TransactionType = "CustomerPayBillOnline",
            Amount = (int)amount, // M-Pesa usually takes integers
            PartyA = phoneNumber,
            PartyB = _config.ShortCode,
            PhoneNumber = phoneNumber,
            CallBackURL = "https://mydomain.com/path", // This would need to be a real public URL
            AccountReference = reference,
            TransactionDesc = $"Payment for {reference}"
        };

        var request = new HttpRequestMessage(HttpMethod.Post, $"{_config.BaseUrl}/mpesa/stkpush/v1/processrequest");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        var response = await _http.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();
        
        try 
        {
            response.EnsureSuccessStatusCode();
            return JsonSerializer.Deserialize<object>(content)!;
        }
        catch
        {
            // Return the raw error content for debugging if it failed
            throw new Exception($"M-Pesa API Error: {content}");
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
