import filesData from "@/services/mockData/files.json";

let files = [...filesData];
const STORAGE_KEY = "quickdrop_files";

// Load files from localStorage on initialization
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      files = JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to load files from localStorage:", error);
  }
};

// Save files to localStorage
const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (error) {
    console.warn("Failed to save files to localStorage:", error);
  }
};

// Initialize storage
loadFromStorage();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fileService = {
  async getAll() {
    await delay(200);
    return [...files];
  },

  async getById(id) {
    await delay(200);
    const file = files.find(f => f.Id === parseInt(id));
    if (!file) throw new Error("File not found");
    return { ...file };
  },

  async create(fileData) {
    await delay(300);
    const newFile = {
      ...fileData,
      Id: files.length > 0 ? Math.max(...files.map(f => f.Id)) + 1 : 1,
      timestamp: Date.now(),
      uploadStatus: "uploading",
      uploadProgress: 0
    };
    files.push(newFile);
    saveToStorage();
    return { ...newFile };
  },

  async update(id, updates) {
    await delay(200);
    const index = files.findIndex(f => f.Id === parseInt(id));
    if (index === -1) throw new Error("File not found");
    
    files[index] = { ...files[index], ...updates };
    saveToStorage();
    return { ...files[index] };
  },

  async delete(id) {
    await delay(200);
    const index = files.findIndex(f => f.Id === parseInt(id));
    if (index === -1) throw new Error("File not found");
    
    const deletedFile = files[index];
    files.splice(index, 1);
    saveToStorage();
    return { ...deletedFile };
  },

  // Simulate file upload with progress updates
  async uploadFile(file, onProgress) {
    const fileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadStatus: "uploading",
      uploadProgress: 0,
      fileUrl: URL.createObjectURL(file),
      thumbnailUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null
    };

    // Create file record
    const newFile = await this.create(fileData);

    // Simulate upload progress
    const totalSteps = 10;
    for (let i = 1; i <= totalSteps; i++) {
      await delay(Math.random() * 200 + 100); // Random delay between 100-300ms
      const progress = Math.round((i / totalSteps) * 100);
      
      const updatedFile = await this.update(newFile.Id, {
        uploadProgress: progress,
        uploadStatus: i === totalSteps ? "completed" : "uploading"
      });

      if (onProgress) {
        onProgress(updatedFile);
      }
    }

    return await this.getById(newFile.Id);
  }
};