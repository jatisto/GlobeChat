using Microsoft.AspNetCore.Http;

public class Session
{
    public static bool IsSet(string Key, HttpContext _context)
    {
        return _context.Session.GetString(Key) != null ? true : false;
    }
}