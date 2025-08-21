import React, { useState } from "react";
import { Upload, Download, ImageIcon, Zap, FileImage, Settings } from "lucide-react";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [compression, setCompression] = useState("medium");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFile = (file) => {
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    if (!selectedImage) return alert("Please select an image.");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("compression", compression);

    try {
      // Simulating API call - replace with your actual endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result - replace with actual API response
      setResult({
        originalSize: selectedImage.size,
        compressedSize: selectedImage.size * 0.7,
        compressedImage: preview // In reality, this would be the compressed image URL
      });
    } catch (err) {
      console.error(err);
      alert("Compression failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const compressionSettings = {
    low: { label: "Low", description: "Minimal compression, best quality", color: "bg-green-500" },
    medium: { label: "Medium", description: "Balanced compression", color: "bg-blue-500" },
    high: { label: "High", description: "Maximum compression, smaller file", color: "bg-orange-500" }
  };

  const calculateSavings = () => {
    if (!result) return 0;
    return ((result.originalSize - result.compressedSize) / result.originalSize * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Image Compressor
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Compress your images while maintaining quality</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Image
              </h2>
              
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  isDragging 
                    ? 'border-purple-500 bg-purple-50 scale-105' 
                    : preview 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-purple-400 hover:bg-purple-25'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {preview ? (
                  <div className="space-y-4">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <FileImage className="w-5 h-5" />
                      <span className="font-medium">{selectedImage?.name}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Size: {(selectedImage?.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drop your image here
                      </p>
                      <p className="text-gray-500 mb-4">or click to browse</p>
                      <div className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
                        Choose File
                      </div>
                    </div>
                  </div>
                )}
                
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Compression Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Compression Level
              </h2>
              
              <div className="space-y-3">
                {Object.entries(compressionSettings).map(([key, setting]) => (
                  <label 
                    key={key}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      compression === key 
                        ? 'border-purple-500 bg-purple-50 shadow-md' 
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                    }`}
                  >
                    <input
                      type="radio"
                      name="compression"
                      value={key}
                      checked={compression === key}
                      onChange={(e) => setCompression(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full mr-3 ${setting.color}`}></div>
                    <div className="flex-1">
                      <div className="font-medium">{setting.label}</div>
                      <div className="text-sm text-gray-500">{setting.description}</div>
                    </div>
                    {compression === key && (
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    )}
                  </label>
                ))}
              </div>

              <button
                onClick={handleUpload}
                disabled={!selectedImage || isLoading}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Compressing...
                  </>
                ) : (
                  <>
                    <Settings className="w-5 h-5" />
                    Compress Image
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileImage className="w-5 h-5" />
                  Compression Results
                </h2>
                
                <div className="space-y-4">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-1">Original Size</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {(result.originalSize / 1024).toFixed(2)} KB
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="text-sm text-green-600 mb-1">Compressed Size</div>
                      <div className="text-2xl font-bold text-green-700">
                        {(result.compressedSize / 1024).toFixed(2)} KB
                      </div>
                    </div>
                  </div>

                  {/* Savings Badge */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-medium">
                      <Zap className="w-4 h-4" />
                      {calculateSavings()}% reduction
                    </div>
                  </div>

                  {/* Compressed Image */}
                  <div className="space-y-3">
                    <img
                      src={result.compressedImage}
                      alt="Compressed"
                      className="w-full max-h-64 object-contain rounded-lg shadow-md mx-auto"
                    />
                    
                    <a
                      href={result.compressedImage}
                      download="compressed-image.jpg"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download Compressed Image
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileImage className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to compress</h3>
                <p className="text-gray-500">Upload an image and select compression settings to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;