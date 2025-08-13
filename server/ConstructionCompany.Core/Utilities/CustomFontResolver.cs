using PdfSharp.Fonts;
using System;
using System.Collections.Generic;
using System.IO;

public class CustomFontResolver : IFontResolver
{
    // Maps the faceName passed by PDFsharp to actual system font file path
    private readonly Dictionary<string, string> _fontFilePaths = new()
    {
        { "Arial", @"C:\Windows\Fonts\arial.ttf" },
        { "Arial#b", @"C:\Windows\Fonts\arialbd.ttf" },
        { "Arial#i", @"C:\Windows\Fonts\ariali.ttf" },
        { "Arial#bi", @"C:\Windows\Fonts\arialbi.ttf" },

        { "Courier New", @"C:\Windows\Fonts\cour.ttf" },
        { "Courier New#b", @"C:\Windows\Fonts\courbd.ttf" },
        { "Courier New#i", @"C:\Windows\Fonts\couri.ttf" },
        { "Courier New#bi", @"C:\Windows\Fonts\courbi.ttf" },

        { "Times New Roman", @"C:\Windows\Fonts\times.ttf" },
        { "Times New Roman#b", @"C:\Windows\Fonts\timesbd.ttf" },
        { "Times New Roman#i", @"C:\Windows\Fonts\timesi.ttf" },
        { "Times New Roman#bi", @"C:\Windows\Fonts\timesbi.ttf" }
    };

    public FontResolverInfo ResolveTypeface(string familyName, bool bold, bool italic)
    {
        string faceName = familyName;

        if (bold && italic)
            faceName += "#bi";
        else if (bold)
            faceName += "#b";
        else if (italic)
            faceName += "#i";

        if (_fontFilePaths.ContainsKey(faceName))
            return new FontResolverInfo(faceName);

        // fallback to Arial regular
        return new FontResolverInfo("Arial");
    }

    public byte[] GetFont(string faceName)
    {
        if (!_fontFilePaths.TryGetValue(faceName, out var path))
            throw new InvalidOperationException($"Font not found: {faceName}");

        return File.ReadAllBytes(path);
    }
}
