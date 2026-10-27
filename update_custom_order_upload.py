import os

filepath = 'src/app/(front)/main/custom-order/page.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Add import
import_cdn = 'import { uploadImage } from "@/api/cdnApi";\n'
content = content.replace('import { createCustomOrder } from "@/api/customOrderApi";', 'import { createCustomOrder } from "@/api/customOrderApi";\n' + import_cdn)

# Add state and handleUpload
state_add = """  const [uploadingImage, setUploadingImage] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadImage(file);
      if (res && res.url) {
        let url = res.url;
        if (!url.startsWith('http')) {
          url = `https://codegrid-api.vercel.app${url.startsWith('/') ? '' : '/'}${url}`;
        }
        setDesignReference(url);
        alert("Design uploaded successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };
"""
content = content.replace('const [designReference, setDesignReference] = useState("");', 'const [designReference, setDesignReference] = useState("");\n\n' + state_add)

# Update dropzone 1
dropzone1_old = """                    <div className="border-[1px] border-dashed border-gray-300 p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer rounded-lg text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-gray-500">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="font-semibold uppercase tracking-widest text-sm mb-2 text-black">Click to upload your logo</p>
                      <p className="text-xs font-medium text-gray-500">Supports PNG, SVG, JPG (Max 5MB)</p>
                    </div>"""
dropzone1_new = """                    <label className="border-[1px] border-dashed border-gray-300 p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer rounded-lg text-center">
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploadingImage} />
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-gray-500">
                        {uploadingImage ? (
                          <svg className="animate-spin h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                          <Upload className="w-6 h-6" />
                        )}
                      </div>
                      <p className="font-semibold uppercase tracking-widest text-sm mb-2 text-black">{uploadingImage ? "Uploading..." : "Click to upload your logo"}</p>
                      <p className="text-xs font-medium text-gray-500">Supports PNG, SVG, JPG (Max 5MB)</p>
                    </label>"""
content = content.replace(dropzone1_old, dropzone1_new)

# Update dropzone 2
dropzone2_old = """                        <div className="border-[1px] border-dashed border-gray-300 p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer rounded-lg text-center">
                          <div className="w-12 h-12 bg-white rounded-full text-gray-500 flex items-center justify-center mb-4 shadow-sm">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="font-semibold uppercase tracking-widest text-sm mb-2 text-black">Click to upload files</p>
                          <p className="text-xs font-medium text-gray-500">Supports PNG, SVG, AI (Max 10MB)</p>
                        </div>"""
dropzone2_new = """                        <label className="border-[1px] border-dashed border-gray-300 p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer rounded-lg text-center">
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploadingImage} />
                          <div className="w-12 h-12 bg-white rounded-full text-gray-500 flex items-center justify-center mb-4 shadow-sm">
                            {uploadingImage ? (
                              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                              <Upload className="w-5 h-5" />
                            )}
                          </div>
                          <p className="font-semibold uppercase tracking-widest text-sm mb-2 text-black">{uploadingImage ? "Uploading..." : "Click to upload files"}</p>
                          <p className="text-xs font-medium text-gray-500">Supports PNG, SVG, AI (Max 10MB)</p>
                        </label>"""
content = content.replace(dropzone2_old, dropzone2_new)

with open(filepath, 'w') as f:
    f.write(content)
