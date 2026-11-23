
string password = "khoa123";

string hash = BCrypt.Net.BCrypt.HashPassword(password);

Console.WriteLine("Mat khau BCrypt:");
Console.WriteLine(hash);
