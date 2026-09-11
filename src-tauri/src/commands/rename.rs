use crate::domain::response::ApiResponse;
use crate::rename::{list_files_in_directory, preview_rename, RenameItemInput, RenamePreviewItem};

#[tauri::command]
pub async fn list_batch_rename_files(
    directory: String,
) -> Result<ApiResponse<Vec<String>>, String> {
    Ok(ApiResponse::success(list_files_in_directory(&directory)?))
}

#[tauri::command]
pub async fn preview_batch_rename(
    items: Vec<RenameItemInput>,
) -> Result<ApiResponse<Vec<RenamePreviewItem>>, String> {
    Ok(ApiResponse::success(preview_rename(items)))
}
