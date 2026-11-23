
using System;

class HashPassword
{
    static void Main()
    {
        Console.Write("Nhap mat khau moi: ");
        string password = Console.ReadLine() ?? "";

        string hash = BCrypt.Net.BCrypt.HashPassword(password);

        Console.WriteLine("\nMat khau da ma hoa:");
        Console.WriteLine(hash);
    }
}
