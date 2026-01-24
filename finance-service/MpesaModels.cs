using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace OmniFinance;

// ... (Existing MpesaService code) ...

// Callback Models
public class MpesaCallback
{
    [JsonPropertyName("Body")]
    public CallbackBody? Body { get; set; }
}

public class CallbackBody
{
    [JsonPropertyName("stkCallback")]
    public StkCallback? StkCallback { get; set; }
}

public class StkCallback
{
    [JsonPropertyName("MerchantRequestID")]
    public string? MerchantRequestID { get; set; }

    [JsonPropertyName("CheckoutRequestID")]
    public string? CheckoutRequestID { get; set; }

    [JsonPropertyName("ResultCode")]
    public int ResultCode { get; set; }

    [JsonPropertyName("ResultDesc")]
    public string? ResultDesc { get; set; }

    [JsonPropertyName("CallbackMetadata")]
    public CallbackMetadata? CallbackMetadata { get; set; }
}

public class CallbackMetadata
{
    [JsonPropertyName("Item")]
    public List<CallbackItem>? Item { get; set; }
}

public class CallbackItem
{
    [JsonPropertyName("Name")]
    public string? Name { get; set; }

    [JsonPropertyName("Value")]
    public object? Value { get; set; }
}
