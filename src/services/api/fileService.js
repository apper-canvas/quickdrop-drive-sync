import { getApperClient } from "@/services/apperClient";

const TABLE_NAME = "file_c";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fileService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "size_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "upload_status_c" } },
          { field: { Name: "upload_progress_c" } },
          { field: { Name: "file_url_c" } },
          { field: { Name: "thumbnail_url_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "CreatedOn" } },
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching files:", error?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "size_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "upload_status_c" } },
          { field: { Name: "upload_progress_c" } },
          { field: { Name: "file_url_c" } },
          { field: { Name: "thumbnail_url_c" } },
          { field: { Name: "timestamp_c" } },
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "File not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching file ${id}:`, error?.message || error);
      throw error;
    }
  },

  async create(fileData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [
          {
            name_c: fileData.name_c || fileData.name,
            size_c: fileData.size_c || fileData.size,
            type_c: fileData.type_c || fileData.type,
            upload_status_c: fileData.upload_status_c || fileData.uploadStatus || "uploading",
            upload_progress_c: fileData.upload_progress_c || fileData.uploadProgress || 0,
            file_url_c: fileData.file_url_c || fileData.fileUrl || "",
            thumbnail_url_c: fileData.thumbnail_url_c || fileData.thumbnailUrl || "",
            timestamp_c: fileData.timestamp_c || fileData.timestamp || Date.now()
          }
        ]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          const errorMsg = result.message || "Failed to create file";
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
      }

      throw new Error("No result returned from create operation");
    } catch (error) {
      console.error("Error creating file:", error?.message || error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const updateData = {
        Id: parseInt(id)
      };

      if (updates.upload_status_c !== undefined || updates.uploadStatus !== undefined) {
        updateData.upload_status_c = updates.upload_status_c || updates.uploadStatus;
      }
      if (updates.upload_progress_c !== undefined || updates.uploadProgress !== undefined) {
        updateData.upload_progress_c = updates.upload_progress_c || updates.uploadProgress;
      }
      if (updates.file_url_c !== undefined || updates.fileUrl !== undefined) {
        updateData.file_url_c = updates.file_url_c || updates.fileUrl;
      }
      if (updates.thumbnail_url_c !== undefined || updates.thumbnailUrl !== undefined) {
        updateData.thumbnail_url_c = updates.thumbnail_url_c || updates.thumbnailUrl;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          const errorMsg = result.message || "Failed to update file";
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
      }

      throw new Error("No result returned from update operation");
    } catch (error) {
      console.error(`Error updating file ${id}:`, error?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          const errorMsg = result.message || "Failed to delete file";
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
      }

      return { success: true };
    } catch (error) {
      console.error(`Error deleting file ${id}:`, error?.message || error);
      throw error;
    }
  },

  async uploadFile(file, onProgress) {
    try {
      const fileData = {
        name_c: file.name,
        size_c: file.size,
        type_c: file.type,
        upload_status_c: "uploading",
        upload_progress_c: 0,
        file_url_c: URL.createObjectURL(file),
        thumbnail_url_c: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
        timestamp_c: Date.now()
      };

      const newFile = await this.create(fileData);

      const totalSteps = 10;
      for (let i = 1; i <= totalSteps; i++) {
        await delay(Math.random() * 200 + 100);
        const progress = Math.round((i / totalSteps) * 100);
        
        const updatedFile = await this.update(newFile.Id, {
          upload_progress_c: progress,
          upload_status_c: i === totalSteps ? "completed" : "uploading"
        });

        if (onProgress) {
          onProgress(updatedFile);
        }
      }

      return await this.getById(newFile.Id);
    } catch (error) {
      console.error("Error uploading file:", error?.message || error);
      throw error;
    }
  }
};