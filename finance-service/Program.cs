using OmniFinance;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpClient<MpesaService>();
// Allow CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors();

// app.UseHttpsRedirection(); // Disable for internal docker comms usually

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/", () => "OmniLogistics Finance Service is Running! [.NET 8]");

app.MapPost("/api/mpesa/pay", async ([FromBody] PaymentRequest req, MpesaService mpesa) =>
{
    try
    {
        var result = await mpesa.TriggerStkPushAsync(req.PhoneNumber, req.Amount, req.Reference);
        return Results.Ok(result);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.MapPost("/api/mpesa/callback", ([FromBody] MpesaCallback callback) =>
{
    var result = callback?.Body?.StkCallback;
    if (result == null) return Results.BadRequest("Invalid Body");

    if (result.ResultCode == 0)
    {
        // Payment Success
        var metadata = result.CallbackMetadata?.Item;
        var amount = metadata?.FirstOrDefault(i => i.Name == "Amount")?.Value;
        var receipt = metadata?.FirstOrDefault(i => i.Name == "MpesaReceiptNumber")?.Value;
        var phone = metadata?.FirstOrDefault(i => i.Name == "PhoneNumber")?.Value;

        Console.WriteLine($"[PAYMENT SUCCESS] Receipt: {receipt}, Amount: {amount}, Phone: {phone}");
        // TODO: Update database order status here
    }
    else
    {
        // Payment Failed / Cancelled
        Console.WriteLine($"[PAYMENT FAILED] Code: {result.ResultCode}, Desc: {result.ResultDesc}");
    }

    return Results.Ok(new { status = "received" });
});

app.MapGet("/invoices", () =>
{
    // Mock data for now
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetInvoices");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

record PaymentRequest(string PhoneNumber, decimal Amount, string Reference);

