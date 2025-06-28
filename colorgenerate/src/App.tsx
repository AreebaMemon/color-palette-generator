import React, { useState, useCallback } from 'react';
import { Copy, Shuffle, Check } from 'lucide-react';

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
}

function App() {
  const [colors, setColors] = useState<Color[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateRandomColor = useCallback((): Color => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    
    return {
      hex: hex.toUpperCase(),
      rgb: { r, g, b }
    };
  }, []);

  const generateColorPalette = useCallback(() => {
    const newColors = Array.from({ length: 4 }, () => generateRandomColor());
    setColors(newColors);
  }, [generateRandomColor]);

  const copyToClipboard = async (color: string, index: number) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const getTextColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  React.useEffect(() => {
    generateColorPalette();
  }, [generateColorPalette]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Color
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Palette
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover beautiful color combinations for your next design project. 
            Generate fresh palettes with a single click.
          </p>
        </div>

        {/* Color Palette */}
        {colors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {colors.map((color, index) => (
              <div
                key={`${color.hex}-${index}`}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl border border-gray-100"
              >
                {/* Color Display */}
                <div
                  className="h-48 relative cursor-pointer transition-all duration-300 group-hover:h-52"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color.hex, index)}
                >
                  {/* Copy Icon */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="p-2 bg-black/20 backdrop-blur-sm rounded-full">
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4" style={{ color: getTextColor(color.hex) }} />
                      ) : (
                        <Copy className="w-4 h-4" style={{ color: getTextColor(color.hex) }} />
                      )}
                    </div>
                  </div>

                  {/* Success Message */}
                  {copiedIndex === index && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full text-sm font-medium animate-fade-in"
                        style={{ color: getTextColor(color.hex) }}
                      >
                        Copied!
                      </div>
                    </div>
                  )}
                </div>

                {/* Color Info */}
                <div className="p-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{color.hex}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                    </p>
                    <button
                      onClick={() => copyToClipboard(color.hex, index)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy HEX
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Generate Button - Moved to Bottom */}
        <div className="text-center mb-8">
          <button
            onClick={generateColorPalette}
            className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Shuffle className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Generate Colors
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Click on any color or the copy button to copy the HEX code to your clipboard
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;